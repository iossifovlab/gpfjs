pipeline {
  agent {
    label 'dory'
  }
  environment {
      BUILD_SCRIPTS_BUILD_DOCKER_REGISTRY_USERNAME = credentials('jenkins-registry.seqpipe.org.user')
      BUILD_SCRIPTS_BUILD_DOCKER_REGISTRY_PASSWORD_FILE = credentials('jenkins-registry.seqpipe.org.passwd')
  }
  stages {
    stage ('Start') {
      steps {
        zulipSend(
          message: "Started build #${env.BUILD_NUMBER} of project ${env.JOB_NAME} (${env.BUILD_URL})",
          topic: "${env.JOB_NAME}")

      }
    }
    stage('Copy artifacts') {
      steps {
          copyArtifacts( filter: 'build-env/seqpipe-containers.build-env.sh', fingerprintArtifacts: true, projectName: 'seqpipe/seqpipe-containers/build-scripts')
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
      archiveArtifacts artifacts: 'build-env/gpfjs.build-env.sh', fingerprint: true
    }
  }
}
