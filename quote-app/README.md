# Full-Stack Quote Application

This project is a simple, full-stack web application that allows users to submit quotes and fetch random quotes. The backend is built with Node.js and Express, and it uses AWS DynamoDB for storage.

## Project Structure

```
quote-app/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
└── README.md
```

## Deployment on AWS EC2 (Amazon Linux 2)

Follow these steps to deploy and run the application on an AWS EC2 instance.

### 1. Launch and Connect to EC2

1.  **Launch an EC2 Instance:**
    *   Go to the AWS EC2 console and launch a new instance.
    *   Choose an Amazon Machine Image (AMI): **Amazon Linux 2 AMI (HVM)**.
    *   Select an instance type (e.g., `t2.micro` is sufficient for this app).
    *   **Configure Security Group:** Create a new security group and add a rule to allow **Custom TCP** traffic on port **3000** from **Anywhere** (or your IP for better security). You also need a rule for SSH (port 22).
    *   Launch the instance with a new or existing key pair.

2.  **Connect via SSH:**
    *   Use your terminal or an SSH client to connect to the instance:
      ```sh
      ssh -i /path/to/your-key.pem ec2-user@<your-ec2-public-ip>
      ```

### 2. Install Node.js and npm

Once connected to your EC2 instance, run the following commands to install Node.js using `nvm` (Node Version Manager).

```sh
# Update the system
sudo yum update -y

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Activate nvm
source ~/.nvm/nvm.sh

# Install the latest LTS version of Node.js
nvm install --lts
```

### 3. Clone or Copy Project Files

Get the project files onto your EC2 instance. You can either clone a Git repository or copy them manually.

**Option A: Clone from Git**

```sh
# Clone your repository
git clone <your-repository-url>
cd quote-app
```

**Option B: Copy Files Manually**

If the files are on your local machine, you can use `scp` to copy them to the EC2 instance.

### 4. Install Dependencies

Navigate to the project directory and install the required npm packages.

```sh
cd /path/to/quote-app
npm install
```

### 5. Configure AWS Credentials for DynamoDB

For the application to communicate with DynamoDB, the EC2 instance needs AWS credentials. The **recommended approach** is to use an IAM role.

**Recommended: Attach an IAM Role to the EC2 Instance**

1.  **Create an IAM Role:**
    *   Go to the IAM console in AWS.
    *   Select **Roles** and click **Create role**.
    *   For the trusted entity, choose **AWS service**, and for the use case, select **EC2**.
    *   **Add Permissions:** Search for and attach the `AmazonDynamoDBFullAccess` policy. For better security in a production environment, you should create a custom policy that only allows actions on your specific "Quotes" table.
    *   Give the role a name and create it.

2.  **Attach the Role to EC2:**
    *   Go back to the EC2 console.
    *   Select your instance, then go to **Actions > Security > Modify IAM role**.
    *   Choose the IAM role you just created and save.

With this setup, your application will automatically use the permissions granted by the role without needing to store credentials on the instance.

### 6. Create the DynamoDB Table

Before running the app, you need to create the `Quotes` table in DynamoDB.

1.  Go to the DynamoDB console in AWS.
2.  Click **Create table**.
3.  **Table name:** `Quotes`
4.  **Primary key:** `id` (with type **String**).
5.  Leave the rest as default and create the table.

### 7. Run the Express App

Now you can start the Node.js server.

```sh
# Start the server
node server.js
```

The server will start, and you'll see the message: `Server running at http://localhost:3000`.

For a more robust setup, it's recommended to use a process manager like `pm2` to keep the application running in the background.

```sh
# Install pm2 globally
sudo npm install pm2 -g

# Start the app with pm2
pm2 start server.js
```

### 8. Access the Application

Open your web browser and navigate to your EC2 instance's public IP address on port 3000:

`http://<your-ec2-public-ip>:3000`

You should see the Quote App interface and be able to submit and fetch quotes.
