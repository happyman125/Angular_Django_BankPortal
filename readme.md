

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Google Cloud / Dialogflow - Banking Portal Demo

**By Lee Boonstra, Customer Engineer @ Google Cloud.**

![alt text](https://github.com/savelee/kube-django-ng/blob/master/images/architecture1.png "Containers")

This demo, showcases a dummy banking portal.
It exists of the following containers:

* Web Front-end - An Angular app (**front-end** folder)
* Dialogflow SDK - A Node JS app (**chatserver** folder)
* CMS - A Python/Django app (**server** folder)

When a customer writes text into the chatbot, the Dialogflow agent matches the answer.
It also pushes the contents to Pub/Sub.

![alt text](https://github.com/savelee/kube-django-ng/blob/master/images/architecture2.png "Cloud Function")

A cloud function has a subscription on the Pub/Sub channel.
See also the **cloudfunctions** folder.

Everytime a message comes in, the message will be passed to the NLP API to detect the sentiment,
and to BigQuery. We run the BigQuery queries in a dashboard.
The **bq** folder contains the queries.

[![Banking Portal Demo](https://img.youtube.com/vi/KhB0hwlyZkg/3.jpg)](https://youtu.be/KhB0hwlyZkg?t=298)

* [Video Banking Portal Demo](https://youtu.be/KhB0hwlyZkg?t=298)

**Disclaimer: This example is made by Lee Boonstra. Written code can be used as a baseline, it's not meant for production usage.**

**Copyright 2018 Google LLC. This software is provided as-is, without warranty or representation for any use or purpose. Your use of it is subject to your agreements with Google.**  

### Automatic Setup on Google Cloud Platform:

[![Open in Cloud Shell](http://gstatic.com/cloudssh/images/open-btn.svg)](https://console.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2Fsavelee%2Fkube-django-ng&cloudshell_working_dir=cloudbuilder&cloudshell_tutorial=TUTORIAL.md)

Guided one click installation from Google Cloud Shell. No client tooling required.

### Manual Setup / Run Locally

#### Setup Google Cloud

1.  Download and install the [Google Cloud
    SDK](https://cloud.google.com/sdk/docs/), which includes the
    [gcloud](https://cloud.google.com/sdk/gcloud/) command-line tool.

2. Open the Google Cloud Console: http://console.cloud.google.com

3. Make sure a Billing Account is setup & linked. (Select Billing in Main Menu)

4.  Create a [new Google Cloud Platform project from the Cloud
    Console](https://console.cloud.google.com/project) or use an existing one.

    Click the + icon in the top bar.
    Enter an unique project name. For example: *yourname-examples*.
    It will take a few minutes till everything is ready.

5. Initialize the Cloud SDK:
    

        $ gcloud init
        2 (Create a new configuration)
        yourname-examples
        (login)
        list
        #number-of-choice
        y

6. Install Kubectl: `gcloud components install kubectl`

#### Authentication

Authentication is typically done through `Application Default Credentials`,
which means you do not have to change the code to authenticate as long as
your environment has credentials. You have a few options for setting up
authentication:

1. When running locally, use the `Google Cloud SDK`

        gcloud auth application-default login


    Note that this command generates credentials for client libraries. To authenticate the CLI itself, use:
    
        gcloud auth login

1. You can create a `Service Account key file`. This file can be used to
   authenticate to Google Cloud Platform services from any environment. To use
   the file, set the ``GOOGLE_APPLICATION_CREDENTIALS`` environment variable to
   the path to the key file, for example:

        export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json

* [Application Default Credentials]( https://cloud.google.com/docs/authentication#getting_credentials_for_server-centric_flow)
* [Additional scopes](https://cloud.google.com/compute/docs/authentication#using)
* [Service Account key file](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount)


### Install Dependencies

1. Install [Node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) if you do not already have them.

2. Install Python3.6: `brew install python3`
3. Install pip: `sudo easy_install pip3`
4. Install virtualenv: `sudo pip3 install virtualenv`

5. Install [Angular CLI](http://cli.angular.io) - 
`npm install -g @angular-cli`

### Enable the APIs

1. Navigate to the Cloud Console: http://console.cloud.google.com

1. Click on **APIs & Services > Dashboard**

1. Click on **Enable APIs & Services**

1. Enable the following APIS:

* BigQuery API
* Cloud Functions API
* Cloud Natural Language API
* Cloud Pub/Sub API
* Kubernetes Engine
* Dialogflow API

* Cloud Data Loss Protection API
* Cloud Translation API
* Cloud Auto ML API

Or via gcloud:

```
gcloud services enable \
  bigquery-json.googleapis.com \
  cloudfunctions.googleapis.com \
  language.googleapis.com \
  pubsub.googleapis.com \
  container.googleapis.com \
  dlp.googleapis.com \
  dialogflow.googleapis.com \
  automl.googleapis.com \
  translate.googleapis.com \
  cloudbuild.googleapis.com \
  sourcerepo.googleapis.com \
  cloudtrace.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com
```

### Setup Service Account

1. Download the Service Account Key

2. Open http://console.cloud.google.com, and navigate to *APIs & Services > Credentials*.

3. Click **Create Credentials**

4. Select **Dialogflow Integrations**

5. Give it the name: *master.json*,  - select for now Project Owner (in production, you might want to fine tune this on least privaliges)

6. Select **JSON**

7. **Create**

8. Download the key, and store it somewhere on your hard drive, and remember the path.

9. In the cloud console, click on **IAM & admin**

10. Pick the Dialogflow Service Account, and add the following roles to it:

   NOTE: For testing purposes, I might add also the *Owner* role to this service account. Though, for production is best to make use of the least privilidges. 

   * Dialogflow Console Agent Editor
   * Dialogflow Reader
   * Logs Writer
   * Storage Object Creator
   * Storage Object Viewer

11. Write down the name of the service account email address. (We will use it, in one of the later steps). The format will look like [service account name]@[projectId].iam.gserviceaccount.com

12. Navigate to Cloud Functions, and take a note of the service account that is used.

    It might the App Engine service account which is created by default.

13. Go back to the **IAM & admin** settings, and make sure the service account used by the Cloud Function,
 has the following roles:

 * BigQuery Data Viewer
 * BigQuery Job User
 * Pub/Sub Editor
 * Pub/Sub Viewer

See also: https://cloud.google.com/iam/docs/permissions-reference

### Setup the Dialogflow Agent

1. (optional) In the cloud console, search for Dialogflow API

2. On the left hand side, select **Dialogflow Agent**

3. Click on **Open or Create Agent at dialogflow.com**

4. Select your google account

5. Allow the terms & conditions

6. Give your agent the name **ContactCenterDemo**

7. For language choose: **English**

8. For time zone choose: **Europe/Madrid**

9. Click **Create**
 
### Configure Dialogflow

1. In the left hand menu, click the **Upgrade button**

1. Choose **Enterprise Edition Essentials**

1. Click on the **gear** icon, in the left menu, next to your project name.

1. Enter the following agent description: **Contact Center Demo**

1. Click **Languages** add Additional Language **NL**

1. Click: **Enable beta features & APIs**

1. Click **Save**

1. Click on **Export & Import**

5. On your hard drive navigate to *chatserver/dialogflow* zip this folder, and then **Import from Zip** in the Dialogflow settings screen. These are some example chatbot dialogs.

### Create Dev and Test Dialogflow Agents

To create automated Dev & Test environments, we will create 2 more Dialogflow agents.
Both enviroments can be created with the Standard edition of Dialogflow.

1. Open http://console.dialogflow.com

1. In the top left drop down box; select: **Create new agent**

1. Give your agent the name **ContactCenterDemo-Dev**

1. Click **Languages** add Additional Language **NL**

1. Click: **Enable beta features & APIs**

1. Click **Save**

1. Repeat this process, but name the agent: **ContactCenterDemo-Test**

1. Visit https://pantheon.corp.google.com/iam-admin/iam?project=ContactCenterDemo-Dev 
and add the email address (written down earlier - [service account name]@[projectId].iam.gserviceaccount.com) from your production service account to this list with **Dialogflow API Admin** rights.

1. Visit https://pantheon.corp.google.com/iam-admin/iam?project=ContactCenterDemo-Test 
and add the email address (written down earlier - [service account name]@[projectId].iam.gserviceaccount.com) from your production service account to this list with **Dialogflow API Admin** rights.

1. Add the two new projectIds to *env.txt*:
DEV_AGENT_PROJECT_ID=
TEST_AGENT_PROJECT_ID=

### Setup Chatbase

1. Navigate to http://www.chatbase.com/bots and login
2. Create a new bot
3. Copy the API_KEY to *env.txt* into the **MY_CHATBASE_KEY** variable.

### Setup Cloud Functions

1. Choose in the left hand menu: **Cloud Functions**

1. Click **Create Function**

1. Name: **chatanalytics**

1. Select Trigger: **Cloud Pub/Sub**

1. Choose topic: **user-content**

1. Runtime: Node JS 8 (beta)

1. Paste the contents of *cloudfunctions/chatanalytics/index.js* into the **index.js** textarea

1. Paste the contents of *cloudfunctions/chatanalytics/package.json* into the **package.json** textarea (tab)

1. The function to execute is: **subscribe**

1. Set the following environment variables:

```
DATASET=chatanalytics
TABLE=chatmessages
```

1. Click **Create**

## Run the code locally

### Django CMS

In case you want to run this for the first time:

```
virtualenv -p python3 myenv
source myenv/bin/activate .
chmod +x /usr/local/bin/django-admin.py
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py createsuperuser
```

Run on the command-line:

```
cd server/
source myenv/bin/activate .
python3 manage.py runserver 8080
```

Django can be reached via http://localhost:8080

### Start Client Container

Run on the command-line:

```
cd front-end
npm install
ng serve
```

The Front-end can be reached via http://localhost:4200

### Start ChatServer Container

In case you want to run this for the first time:

1. Rename the file from the command-line, and edit:

   ```
   cd ../chatserver/my-app/
   npm install
   mv env.txt .env
   nano .env
   ```

1. Modify the code:

   ```
   GCLOUD_PROJECT=<PROJECT NAME>
   GOOGLE_APPLICATION_CREDENTIALS=<LOCATION OF YOUR SERVICE ACCOUNT FILE>
   ```

1. Then run on the command-line:

   ```
   npm start
   ```

## Dialogflow Demo flow:

1. First explain the concepts of Dialogflow: http://console.dialogflow.com

 Dialogflow has Natural Language Understanding (Machine Learning). The chatbots work through
 intent matching. The user trains user trained phrases. As soon as Dialogflow detects a match
 with the intent with the highest confidence level, it returns the answer.

 Show the **Use Case 1 - transfer money intent** and explain how to setup:

 * Intents (User phrases & Responses)
 * Entities
 * Fulfillments
 * Integrations

1. Open http://localhost:4200

1. Navigate to the **Support** tab.

1. Use the following chatflow:

   ```
   U: I would like to transfer money
   > To which bank account number?
   U: IBAN1233435
   > How much would you like to tranfer?
   U: 100 euro
   > To which country?
   U: Germany
   > Alright! I will tranfer 100 euro to IBAN1233435 Germany.
   ```
    
1. Now navigate to the **Dashboard** and explain the following:

    * We have collected x amount of messages over time.
    * x amount of these messages contained negative user sentiment.
    * Explain that we will optimize our chatbot based on the feedback of our users.
    * Let's query on the session id, to figure out what went wrong, and read the transcript.
    * Explain how this was built, by showing the architecture, and mentioning all the GCP components.

1. In case you want to demonstrate the Knowledge Base Connector:

    * Show http://localhost:4200/faq/faq.html explain you want to import these FAQs in Dialogflow
    * Make sure you enabled **Enable Beta features & API** in the Dialogflow Settings panel.
    * Click on the **Knowledge** menu item.
    * Create a new Knowledge Base: **Future Bank**
    * Click **Create the first one**.
    * Document name: **Bank FAQ**, Knowledge type: **FAQ**, Mime type: **text/html**
    * See the below note, or use this URL: http://www.futurebank.nl/assets/html/faq/faq.html
    * Click **Save**, Dialogflow will crawl your page, and index Question & Answer pairs.
    * Click **Add response**
    * Give it the following reponse: `$Knowledge.Answer[1]`
    * Click **Save**, wait till it got trained, and test with the following question:


    ```
    U: When did they form the Future Bank?
    >The Future Bank is a conceptional demo project. 
    If Google were to start a bank, what would it look like?
    ```

*NOTE: In order to make the KB Connector work with your own FAQ pages, you will need a public available HTML website with (server generated) HTML. The website will need to allow Google Robots, and needs to be added to the Google search engine. (pages.github won't work.) 
You will need more than one Q&A pair and not more than 200.
It helps when you use valid HTML5 markup for your Q&As, and base it on schema.org notations.
See the markup of: https://github.com/savelee/kube-django-ng/blob/master/front-end/src/assets/html/faq/faq.html for a good overview.*

## AutoML Demo flow:

TODO

## Deploy your code to GKE with Cloud Builder

1. Create a GKE Cluster:

    `gcloud container clusters create futurebank --region europe-west4-a --num-nodes 1 --enable-autoscaling --min-nodes 1 --max-nodes 4`

    (when you already have a cluster, and you get the error **The connection to the server localhost:8080 was refused - did you specify the right host or port?**, type: `gcloud container clusters get-credentials "futurebank" --zone europe-west4-a`)

2. Set your **PROJECT_ID**, **DEV_AGENT_PROJECT_ID**, **TEST_AGENT_PROJECT_ID**, **GCLOUD_STORAGE_BUCKET** and **MY_CHATBASE_KEY** variables, which points to your GCP project id. For example:

    `export PROJECT_ID=dialogflow-production-agent`
    `export DEV_AGENT_PROJECT_ID=dialogflow-dev-agent`
    `export TEST_AGENT_PROJECT_ID=dialogflow-test-agent`
    `export MY_CHATBASE_KEY=123...`
    `export MY_CHATBASE_VERSION=1.0`
    `export GCLOUD_STORAGE_BUCKET=mybucket`
    

3. Navigate to the root of this repository.

4. Create a secret from your service account **master.json** key

    `kubectl create secret generic credentials --from-file=./master.json`

5. Create a config map:
   
    `kubectl create configmap chatserver-config --from-literal "GCLOUD_PROJECT=${PROJECT_ID}" --from-literal "DEV_AGENT_PROJECT_ID=${DEV_AGENT_PROJECT_ID}" --from-literal "TEST_AGENT_PROJECT_ID=${TEST_AGENT_PROJECT_ID}" --from-literal "LANGUAGE_CODE=en-US" --from-literal "TOPIC=user-content" --from-literal "DATASET=chatanalytics" --from-literal "TABLE=chatmessages" --from-literal "DATASET_TEST_METRICS=conversationcoverage" --from-literal "TABLE_TEST_METRICS=testmetrics" --from-literal "MY_CHATBASE_KEY=${MY_CHATBASE_KEY}" --from-literal "MY_CHATBASE_BOT_NAME=Babs the Banking Bot" --from-literal "MY_CHATBASE_VERSION=${MY_CHATBASE_VERSION}" --from-literal "GCLOUD_STORAGE_BUCKET=${GCLOUD_STORAGE_BUCKET}"`

6. Fix paths to your images of the **-deployment.yaml** & **setup** files (in the cloudbuilder folder) to match the container names in your Container Registry.

7. When you setup your cluster for the first time, you can run this command from the root directory:

    `gcloud builds submit --config cloudbuilder/setup.yaml`

8. In case you want to re-deploy individual containers, run the following build scripts:

   `gcloud builds submit --config cloudbuilder/chatserver.yaml`

   `gcloud builds submit --config cloudbuilder/front-end.yaml`

   `gcloud builds submit --config cloudbuilder/django.yaml`

9.  To delete deployments use:

   `kubectl delete deployment front-end`

   `kubectl delete deployment chatserver`
    
   `kubectl delete deployment django`


10. To deploy another deployment:

   `kubectl apply -f cloudbuilder/front-end-deployment.yaml`

   `kubectl apply -f cloudbuilder/chatserver-deployment.yaml`

   `kubectl apply -f cloudbuilder/django-deployment.yaml`

11. Get a static IP:

  A domain name is needed for an SSL certificate. We also want to create a fixed ‘A record’ for it on the name registrar. With an Ingress, the external IP keeps changing as it is deleted and created. We can solve this problem on GCP by reserving an external IP address which we can then assign to the Ingress each time.

  https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address

  `gcloud compute --project=${PROJECT_ID} addresses create futurebank --global --network-tier=PREMIUM`

12. Now setup the services and ingress loadbalancer:

    `kubectl apply -f cloudbuilder/ingress.yaml`

    *NOTE: The important thing here is specifying the type of the Service as NodePort . This allocates a high port on each node in the cluster which will proxy requests to the Service.
    Google’s Load Balancer performs health checks on the associated backend service. The service must return a status of 200. If it does not, the load balancer marks the instance as unhealthy and does not send it any traffic until the health check shows that it is healthy again.*


13. Attach a domain name:

  To have browsers querying your domain name (such as example.com) or subdomain name (such as blog.example.com) point to the static IP address you reserved, you must update the DNS (Domain Name Server) records of your domain name. You must create an **A (Address) type DNS record** for your domain or subdomain name and have its value configured **with the reserved external IP address**.
