# Doughnutted 🍩

## About Doughnutted

Doughnutted is a fun, interactive web application designed to promote better cybersecurity practices in office environments. It turns the important habit of locking your computer when you step away into an engaging, donut-themed game.

## How It Works

1. 🔓 When an employee leaves their computer unlocked and unattended
2. 👀 A colleague can use the unattended computer to visit this website
3. 🍩 They log the "offender" in the system
4. 💰 The forgetful employee now owes donuts to the office
5. 🏆 A leaderboard tracks who has been "doughnutted" the most

## Why This Matters

This application serves an important security purpose: if a colleague has enough time to access your computer and log a doughnut offense, they would also have enough time to do something malicious. Doughnutted makes security awareness fun while reinforcing good habits.

## Features

- **Simple Reporting**: Quick input to log offenders
- **Leaderboard**: Track the worst offenders in your office
- **Debt Tracking**: Keep tabs on who owes donuts
- **One-time submission**: Users can only submit one entry per page load
- **Animated feedback**: Fun confetti effects when actions are taken

## Technical Details

This application is built using:

- **Frontend**: Angular.js
- **Backend**: AWS Amplify
- **Authentication**: Amazon Cognito
- **Database**: Amazon DynamoDB
- **API**: AWS AppSync (GraphQL)
- **Storage**: Amazon S3

## Getting Started

### Prerequisites

- Node.js and npm
- AWS Account
- AWS Amplify CLI

### Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/doughnutted.git
   ```

2. Install dependencies
   ```
   cd doughnutted
   npm install
   ```

3. Initialize Amplify
   ```
   amplify init
   ```

4. Push Amplify configuration
   ```
   amplify push
   ```

5. Start the development server
   ```
   npm start
   ```

## Deployment

For detailed instructions on deploying your application to AWS, refer to the [AWS Amplify deployment documentation](https://docs.amplify.aws/angular/start/quickstart/#deploy-a-fullstack-app-to-aws).

## License

This library is licensed under the MIT-0 License. See the LICENSE file.