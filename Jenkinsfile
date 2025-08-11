pipeline {
  agent { label 'piglet' }
  options {
    copyArtifactPermission('/iossifovlab/*,/seqpipe/*');
    disableConcurrentBuilds()
  }
  environment {
    BUILD_SCRIPTS_BUILD_DOCKER_REGISTRY_USERNAME = credentials('jenkins-registry.seqpipe.org.user')
    BUILD_SCRIPTS_BUILD_DOCKER_REGISTRY_PASSWORD_FILE = credentials('jenkins-registry.seqpipe.org.passwd')
    SONARQUBE_DEFAULT_TOKEN=credentials('sonarqube-default')
  }

  stages {
    stage('Start') {
      steps {
        zulipSend(
          message: "Started build #${env.BUILD_NUMBER} of project ${env.JOB_NAME} (${env.BUILD_URL})",
          topic: "${env.JOB_NAME}")
      }
    }
    stage('Generate stages') {
      steps {
        sh "./build.sh preset:slow build_no:${env.BUILD_NUMBER} generate_jenkins_init:yes"
        script {
          load('Jenkinsfile.generated-stages')
        }
      }
    }
  }
  post {
    always {
      script {
        try {
          discoverGitReferenceBuild(latestBuildIfNotFound: true, maxCommits: 400, skipUnknownCommits: true)

          resultBeforeTests = currentBuild.currentResult
          junit 'coverage/junit-report.xml'
          sh "test ${resultBeforeTests} == ${currentBuild.currentResult}"

          recordCoverage sourceCodeEncoding: 'UTF-8', enabledForFailure: true, sourceCodeRetention: 'LAST_BUILD', tools: [
            [parser: 'COBERTURA', pattern: 'coverage/cobertura-coverage.xml']
          ]

          recordIssues(
            enabledForFailure: true, aggregatingResults: false,
            tools: [
              checkStyle(pattern: 'css-lint-report.xml', reportEncoding: 'UTF-8', id: 'checkstyle-css', name: 'CSS lint'),
              checkStyle(pattern: 'ts-lint-report.xml', reportEncoding: 'UTF-8', id: 'checkstyle-ts', name: 'TS lint'),
            ],
            qualityGates: [[threshold: 1, type: 'DELTA', unstable: true]]
          )
        } finally {
          zulipNotification(
            topic: "${env.JOB_NAME}"
          )
        }

        archiveArtifacts artifacts: 'packages/*.tar.gz',
                   allowEmptyArchive: true,
                   fingerprint: true,
                   onlyIfSuccessful: true

      }
    }
    unstable {
        script {
            load('build-scripts/libjenkinsfile/zulip-tagged-notification.groovy').zulipTaggedNotification()
        }
    }
    failure {
      script {
        load('build-scripts/libjenkinsfile/zulip-tagged-notification.groovy').zulipTaggedNotification()
      }
    }
  }
}
