PORT=8080

CLIENT_ID=976789947474-a3d4hteu14kc4ve10ue9500digrbe69j.apps.googleusercontent.com

# Frontend Site URL
SITE_URL=http://localhost:3000

# URL of the Mongo DB
MONGODB_URL=mongodb+srv://ganeshchilakala11:ganeshchilakala11@cluster0.smj9lrn.mongodb.net/SocialMediaDataBase?retryWrites=true&w=majority

# JWT
# JWT secret key
JWT_SECRET=SuperSecretShhhhhhhhhhh
# Number of minutes after which an access token expires default 1440 minutes i.e. 24 hours
JWT_ACCESS_EXPIRATION_MINUTES=1440
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=60
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=60

# Email configuration
# Service Provider => smtp, sendgrid, aws
EMAIL_PROVIDER=smtp
# Service Provider Key ID => Only for aws mailer
EMAIL_PROVIDER_KEY_ID=NA
# Service Provider Key => Only for sendgrid and aws mailer
EMAIL_PROVIDER_KEY=NA
# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USERNAME=jed.block38@ethereal.email
SMTP_PASSWORD=DbwQGFChvJ7dZjYQwz
EMAIL_FROM=support@yourapp.com
