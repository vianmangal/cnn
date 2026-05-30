resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.project_name}-database-url"
  description = "DATABASE_URL for emotionlens backend"
}

resource "aws_secretsmanager_secret" "secret_key" {
  name        = "${var.project_name}-secret-key"
  description = "SECRET_KEY for emotionlens backend"
}
