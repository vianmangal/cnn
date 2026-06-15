resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.project_name}-database-url"
  description = "DATABASE_URL for emotionlens backend"
}
