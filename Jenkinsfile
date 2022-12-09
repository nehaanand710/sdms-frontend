pipeline {
    agent any

    // parameters {
    //     string(name: 'branchname', defaultValue: 'main', description: 'Branch Name to build upon')
    // }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                script{
                    sh"""
                    set -xe
                    pwd
                    ls
                    mkdir src
                    cp -R ui src
                    zip -r SDM_frontend-${BUILD_NUMBER}.zip src manifest.json sw.js
                    rm -rf src
                    rm -rf ui
                    ls
                    """
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing done...'
            }
        }
        stage('Upload to S3') {
            steps {
                echo 'Uploading to S3...'
                script{
                    withAWS(credentials:'AWS', region:'us-east-2') {
                        s3Upload(file:"SDM_frontend-${BUILD_NUMBER}.zip", bucket:'dev-sdm-ui/ui-builds')
                    }
                    sh"""
                    echo "Removing uploaded file to save space..."
                    rm -rf SDM_frontend-*
                    """
                }
            }
        }
    }
}