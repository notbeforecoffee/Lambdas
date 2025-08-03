# Fulhaus AWS Lambdas

A comprehensive collection of AWS Lambda functions that power the Fulhaus Studio application ecosystem. This repository contains serverless functions for various business operations including data processing, email management, image processing, and location services.

## 📁 Repository Structure

```
├── Fulhaus-App-Lambdas/           # Core application lambdas
│   ├── Lambda_remove-backgrounds/ # Image background removal service
│   ├── Lambda_location-search/    # Google Places API integration
│   ├── Lambda_inspo-image/        # Inspiration image storage
│   ├── Lambda_emails/             # Email sending functionality
│   └── search-address.zip         # Address search service
├── AWS-Vendor-Data-Processing/    # Vendor data transformation pipeline
└── AWS-Email-Inventory-Processing/ # Email-based inventory processing
```

## 🚀 Lambda Functions

### Fulhaus App Lambdas

#### 📸 Lambda Remove Backgrounds
- **Purpose**: Removes backgrounds from images using a paid API service
- **Features**: 
  - Checks S3 for existing processed images to avoid duplicate processing
  - Stores processed images in S3 for reuse
  - Called from the Fulhaus web frontend
- **Dependencies**: express, mongoose, uuidv4

#### 🔍 Lambda Location Search
- **Purpose**: Implements location search functionality using Google Places API
- **Features**: 
  - Provides location search capabilities for the Fulhaus app
  - Triggered from web frontends
- **Technology**: TypeScript
- **Dependencies**: Various Google Places API dependencies

#### 🎨 Lambda Inspiration Image
- **Purpose**: Handles inspiration image uploads and storage
- **Features**: 
  - Stores uploaded inspiration images in S3
  - Triggered from studio-service
- **Dependencies**: AWS SDK and related services

#### 📧 Lambda Emails
- **Purpose**: Sends preset/form emails to users
- **Features**: 
  - Triggered from the Fulhaus app
  - Uses email templates from accounts-service repo
  - Templates created in MJML and Mustache
- **Dependencies**: Email service dependencies

#### 🏠 Search Address
- **Purpose**: Address search functionality
- **Format**: Deployed as a ZIP file
- **Size**: 2.2MB

### Data Processing Lambdas

#### 🔄 AWS Vendor Data Processing
- **Purpose**: Comprehensive vendor data transformation and processing pipeline
- **Components**:
  - `transformer/`: Data transformation logic
  - `processor/`: Data processing operations
  - `parser/`: Data parsing utilities
  - `models/`: Data models
  - `config/`: Configuration files
- **Dependencies**: aws-sdk, axios, csvtojson, mongoose, rsa-xml
- **Version**: 2.0.0

#### 📬 AWS Email Inventory Processing
- **Purpose**: Processes inventory data received via email
- **Features**:
  - Integrates with Gmail APIs for email processing
  - Supports multiple vendor configurations via `vendor-details.json`
  - Converts Excel files to CSV format
  - Uses S3 for configuration storage
- **Configuration**: Vendor details stored in S3 config bucket (`fulhaus-vendor-data`)
- **Dependencies**: aws-sdk, base64url, dotenv, googleapis, xlsx-to-csv

## 🛠️ Setup and Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js (version 14 or higher recommended)
- Access to Fulhaus AWS environment

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Lambdas
   ```

2. Install dependencies for each lambda:
   ```bash
   # For individual lambdas
   cd Fulhaus-App-Lambdas/Lambda_<function-name>
   npm install
   
   # For data processing lambdas
   cd AWS-Vendor-Data-Processing
   npm install
   
   cd ../AWS-Email-Inventory-Processing
   npm install
   ```

### Configuration
- Ensure AWS credentials are properly configured
- Set up necessary environment variables for each lambda
- Configure S3 buckets and IAM roles as required
- Update vendor configurations in S3 for email inventory processing

## 🔧 Development

### Adding New Lambdas
1. Create a new directory in the appropriate section
2. Include a `package.json` with necessary dependencies
3. Add a `README.md` describing the lambda's purpose
4. Include the main function file (`index.js`, `index.ts`, or `index.mjs`)

### Testing
- Each lambda should include appropriate tests
- Use AWS SAM or similar tools for local testing
- Ensure proper error handling and logging

## 📋 Environment Variables

Common environment variables that may be required:
- `AWS_REGION`: AWS region for deployment
- `S3_BUCKET`: S3 bucket for file storage
- `DATABASE_URL`: MongoDB connection string (if applicable)
- `API_KEYS`: External service API keys

## 🔐 Security

- API keys and sensitive data should be stored in AWS Secrets Manager
- Use IAM roles with minimal required permissions
- Implement proper input validation and sanitization
- Regular security audits and dependency updates

## 📞 Support

For questions or issues related to these lambda functions, please contact the Fulhaus development team.

## 📄 License

This project is proprietary to Fulhaus. All rights reserved. 
