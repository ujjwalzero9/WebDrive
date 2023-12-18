# WebDrive Project

WebDrive is a web application that provides a user-friendly interface for managing and organizing files and folders in the cloud. It comes with a Django backend and a React frontend.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contact Information](#contact-information)

## Project Overview

WebDrive aims to simplify file and folder management by providing users with a seamless experience. The project consists of a Django backend that handles server-side operations and a React frontend for the user interface.

## Features

- **User Authentication:** Users can create accounts, log in, and securely manage their files.
- **File and Folder Operations:** Create, delete, rename, and organize files and folders.
- **File Upload and Download:** Upload files to the cloud and download them when needed.
- **Security:** User authentication and secure API endpoints ensure data privacy.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>

# WebDrive Project

WebDrive is a web application that provides a user-friendly interface for managing and organizing files and folders in the cloud. It comes with a Django backend and a React frontend.

## Usage

1. Access the application at [http://localhost:3000](http://localhost:3000) in your web browser.
2. Sign up or log in to your account.
3. Explore and manage your files and folders through the intuitive interface.

## API Endpoints

- **Create User:** `POST /api/create_user/`
- **Create Entity (File/Folder):** `POST /api/create_entity/`
- **Get Folder Contents:** `GET /api/get_folder_contents/`
- **Delete Entity:** `DELETE /api/delete_entity/`
- **Move Entity:** `PUT /api/move_entity/{entity_id}/`
- **Get Entities in Home:** `GET /api/get_entities_in_home/`
- **Get Entities:** `POST /api/get_entities/`
- **Get Presigned URL:** `POST /api/get_presigned_url/`
- **Login:** `POST /api/login/`
- **Validate Credentials:** `POST /api/validate-credentials/`
- **Rename Entity:** `PUT /api/rename_entity/`
- **Entity Details:** `POST /api/entity_details/`

## Contact Information

For any inquiries or support, please contact:

- **Developer:** [Ujjwal Kumar]
- **Email:** [Ujjwalzero9@gmail.com]
- **LinkedIn:** [https://www.linkedin.com/in/ujjwalzero9/]
- **GitHub:** [https://github.com/ujjwalzero9/]
