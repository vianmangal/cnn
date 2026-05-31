AWS prep: Have AWS CLI configured, Terraform installed, and an ACM cert ARN ready for the ALB.

Infra: From infra run terraform init then terraform apply with aws_region, acm_certificate_arn, db_username, db_password.

Model: Upload emotion_model.keras to S3 bucket emotionlens-models.

Secrets: Put DATABASE_URL and SECRET_KEY values into Secrets Manager.

Backend first deploy: Login to ECR, build/push backend image (tag latest) from Dockerfile.

Database migration: Run Alembic upgrade using ECS run-task (one‑off).

GitHub secrets: Set AWS_ROLE_ARN, VITE_API_URL, FRONTEND_BUCKET, CLOUDFRONT_DISTRIBUTION_ID, ECS_SUBNETS, ECS_SECURITY_GROUPS.

CI/CD: Push to main to trigger automated backend/ frontend deploy.