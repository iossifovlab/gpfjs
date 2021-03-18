pipeline {
  agent any
  stages {
    stage ('Start') {
      steps {
        zulipSend(
          message: "Started build #${env.BUILD_NUMBER} of project ${env.JOB_NAME} (${env.BUILD_URL})",
          topic: "${env.JOB_NAME}")

      }
    }
    stage('Setup') {
      steps {
        sh "rm -rf node_modules package-lock.json"
        sh "npm install"
      }
    }
    stage('Lint') {
      steps {
        sh '''
          ng lint --format checkstyle > ts-lint-report.xml || echo \"tslint exited with \$?\"
          sed -i '$ d' ts-lint-report.xml
        '''
      }
    }
    stage('Test') {
      steps {
        sh "ng test -- --no-watch --no-progress --code-coverage --browsers=ChromeHeadlessCI"
      }
    }
  }
  post {
    always {
      junit 'coverage/junit-report.xml'
      step([
        $class: 'CoberturaPublisher',
        coberturaReportFile: 'coverage/cobertura-coverage.xml'
      ])
      zulipNotification(
        topic: "${env.JOB_NAME}"
      )      
    }

    success {

      script {
          def job_result = build job: 'seqpipe/seqpipe-gpf-containers/master', propagate: true, wait: false, parameters: [
              string(name: 'GPF_BRANCH', value: "master"),
              booleanParam(name: "PUBLISH", value: false)
          ]
      }
    }

  }
}
