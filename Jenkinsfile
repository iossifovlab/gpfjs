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
    stage('Generate stages') {
      steps {
        sh './build.sh Jenkinsfile.generated-stages'
        script {
          load('Jenkinsfile.generated-stages')
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

//     success {
//
//       script {
//           def job_result = build job: 'seqpipe/seqpipe-gpf-containers/master', propagate: true, wait: false, parameters: [
//               string(name: 'GPF_BRANCH', value: "master"),
//               booleanParam(name: "PUBLISH", value: false)
//           ]
//       }
//     }
  }
}
