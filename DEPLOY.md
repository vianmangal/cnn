# EmotionLens AWS Deployment

## Prerequisites

- AWS CLI configured (`aws configure`)
- Terraform installed
- GitHub repo secrets set (see below)

## Step 1: Provision infrastructure

```bash
cd infra
terraform init
terraform apply \
  -var="aws_region=ap-south-1" \
  -var="acm_certificate_arn=arn:aws:acm:ap-south-1:ACCOUNT_ID:certificate/CERT_ID" \
  -var="db_username=emotionuser" \
  -var="db_password=strongpassword"
```

Useful outputs:

```bash
terraform output cloudfront_domain
terraform output alb_dns_name
terraform output ecr_repository_url
terraform output rds_endpoint
```

## Step 2: Upload the model to S3

```bash
aws s3 cp emotion_model.keras s3://emotionlens-models/emotion_model.keras --region ap-south-1
```

## Step 3: Populate Secrets Manager values

```bash
aws secretsmanager put-secret-value \
  --secret-id emotionlens-database-url \
  --secret-string "postgresql+asyncpg://emotionuser:strongpassword@<rds_endpoint>:5432/emotiondb" \
  --region ap-south-1
```

## Step 4: Build and push the initial backend image

```bash
ECR_REPO=$(terraform -chdir=infra output -raw ecr_repository_url)
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin "$ECR_REPO"

docker build -f backend/Dockerfile -t "$ECR_REPO:latest" .
docker push "$ECR_REPO:latest"
```

## Step 5: Configure GitHub Actions secrets

Set these repository secrets:

- `AWS_ROLE_ARN` (GitHub OIDC role for deployments)
- `FRONTEND_BUCKET` (emotionlens-frontend)
- `CLOUDFRONT_DISTRIBUTION_ID` (from CloudFront console)
- `ECS_SUBNETS` (comma-separated private subnet IDs)
- `ECS_SECURITY_GROUPS` (comma-separated ECS security group IDs)

`VITE_API_URL` is optional. The recommended production setup is to proxy `/predict` and `/health` through CloudFront on the same site domain.

Helper commands to fetch subnet and SG IDs:

```bash
aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=emotionlens-private-*" \
  --query "Subnets[*].SubnetId" \
  --output text

aws ec2 describe-security-groups \
  --filters "Name=tag:Name,Values=emotionlens-ecs-sg" \
  --query "SecurityGroups[*].GroupId" \
  --output text
```

## Step 6: Run the initial DB migration

```bash
aws ecs run-task \
  --cluster emotionlens-cluster \
  --launch-type FARGATE \
  --task-definition emotionlens-backend \
  --network-configuration "awsvpcConfiguration={subnets=[SUBNET_1,SUBNET_2],securityGroups=[SG_ID],assignPublicIp=DISABLED}" \
  --overrides '{"containerOverrides":[{"name":"backend","command":["alembic","-c","/app/alembic.ini","upgrade","head"]}]}'
```

## Step 7: Deploy on every push

Push to `main` and GitHub Actions will:

- Build and push the backend image to ECR
- Register a new task definition and redeploy ECS
- Run Alembic migrations
- Build the frontend and sync to S3 + CloudFront invalidation
