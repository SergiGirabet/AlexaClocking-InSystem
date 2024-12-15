📚 Voice Clocking-In System with Alexa for SEMIC Group
This repository contains the code and development process for integrating a voice-based clocking-in system into SEMIC Group's business operations using Amazon Alexa. The project focuses on enabling workers to clock-in and out seamlessly through voice recognition, improving efficiency and accessibility.

🔍 Project Overview
The purpose of this project is to develop an Alexa skill that:
- Recognizes and distinguishes the voice of employees.
- Facilitates clocking-in and clocking-out by integrating with SEMIC Group's existing registration system. 
- The project demonstrates the combination of voice technology, artificial intelligence (AI), and API integration to streamline business operations.

🚀 Features
1. Voice Recognition
- Employees can clock-in or clock-out using their voice.
- The Alexa skill distinguishes between different employees based on their voice input.
- 
2. API Integration
- The system connects to SEMIC Group's clocking-in API for real-time data synchronization.
  
3. Alexa Skill Development
- Utilizes the Alexa Skills Kit (ASK) and its voice interaction model.
- Custom voice commands are created for seamless interaction.

4. Scalable and Cost-Effective
- Detailed analysis of implementation costs, including hardware, software, and human resources.
  
🛠️ Technologies Used
- Amazon Alexa Skills Kit (ASK): For developing the voice assistant skill.
- Django:  SOAP API for employee clocking-in/out data.
- Python: Backend development and integration with APIs.
- XAMPP: To easily set up a web server environment on our own computer. It is useful for developing and testing web applications locally
before uploading them to an online server.
- MySQL: MySQL has been used to retain the data of the inputs and outputs of the workers.
- PostgreSQL: Changed my database source  when deploying our application on
Heroku.
- Heroku: The deployment of the clocking-in API.
- Postman: Used to test and interact with my API.
- Artificial Intelligence & Machine Learning: For voice recognition and natural language processing.

📁 Project Structure
AlexaProject/
│
├── clocking-system-soap/        # Main integration folder
│   ├── clocking/                # Code for clocking-in logic
│   │   ├── manage.py            # Core logic for API and clocking process
│   │   ├── settings.py          # Configuration file
│   │   ├── requirements.txt     # Python dependencies
│   │   ├── runtime.txt          # Runtime environment
│   │   ├── README.md            # Project-specific details
│   │   └── ...                  # Additional modules
│   │
│   ├── README.md                # Overview of the clocking-system-soap folder
│   └── requirements.txt         # Dependencies for clocking-system-soap
│
├── developer-console-code/      # Code for Alexa interaction and testing
│
├── .gitignore                   # Files to ignore in Git
├── Clocking-soapui-project.xml  # Project configuration file
└── README.md                    # This file

🔧 Setup and Installation

1. Clone the Repository
   
git clone https://github.com/SergiGirabet/AlexaProject.git
cd AlexaProject

2. Install Dependencies
Navigate to the relevant directory and install the required packages:

cd clocking-system-soap/clocking
pip install -r requirements.txt

3. Configure API
- Update settings.py with the correct API endpoint and credentials for SEMIC Group's clocking-in system.

4. Deploy Alexa Skill
- Use the Alexa Skills Kit (ASK) to deploy and test the skill.
  
🧪 Testing the Alexa Skill
1. Deploy the skill to the Alexa Developer Console.
2. Use the following sample utterances for testing:
- "Alexa, open clocking system."
- "Clock me in."
- "Clock me out."
- "Who am I?"
3. Monitor the API logs to ensure proper data flow and response.

💡 Future Improvements
Add multi-factor authentication for enhanced security.
Improve voice recognition accuracy with machine learning models.
Expand support for additional voice assistants (e.g., Google Assistant).

📄 Conclusion
This project provides a robust solution for SEMIC Group to modernize its employee clocking-in system using voice technology. By integrating an Alexa skill with SEMIC's API, the system offers improved efficiency, ease of use, and scalability.

👥 Contributors
Sergi Girabet - Developer

📜 License
This project is licensed under the MIT License.

