def upstream_jobs = [
  "seqpipe/seqpipe-containers/${env.BRANCH_NAME}"
]
def upstream_jobs_symlinks = [: ]
upstream_jobs.each() {
  def upstream_job_master_branch = it.substring(0, it.lastIndexOf('/')) + "/master"
  upstream_jobs_symlinks[it] = upstream_job_master_branch
}
def upstream_jobs_symlinks_joined_str = upstream_jobs_symlinks.entrySet().collect({
  it.key + "," + it.value
}).join(',')

def upstream_jobs_symlinks_adjusted = [: ]
def SKIP = "false"
def GITHUB_REPOSITORY_NAME = currentBuild.fullProjectName.substring(currentBuild.fullProjectName.indexOf('/') + 1, currentBuild.fullProjectName.lastIndexOf('/'))

pipeline {
  agent {
    label 'dory || piglet || pooh'
  }
  triggers {
    upstream(upstreamProjects: upstream_jobs_symlinks_joined_str, threshold: hudson.model.Result.SUCCESS)
    cron('@weekly')
  }
  options {
    copyArtifactPermission('/iossifovlab/gpf/*,/iossifovlab/gpf/master,/seqpipe/gpf_documentation/*,/seqpipe/seqpipe-gpf-containers/*,/seqpipe/gpf-e2e/*,/seqpipe/pheno_db_build/*');
    disableConcurrentBuilds();
  }
  environment {
    BUILD_SCRIPTS_BUILD_DOCKER_REGISTRY_USERNAME = credentials('jenkins-registry.seqpipe.org.user')
    BUILD_SCRIPTS_BUILD_DOCKER_REGISTRY_PASSWORD_FILE = credentials('jenkins-registry.seqpipe.org.passwd')
  }
  stages {
    stage('init') {
      steps {
        script {
          println("upstream_jobs:")
          println(upstream_jobs)
          println()
          println("upstream_jobs_symlinks:")
          println(upstream_jobs_symlinks)
          println()

          def upstream_jobs_symlinks_obsolete = [: ]

          upstream_jobs_symlinks.keySet().each() {
            def name = it
            def target = upstream_jobs_symlinks[name]

            upstream_jobs_symlinks_obsolete[name] = false

            def jenkins_job = Jenkins.instance.getItemByFullName(name)
            if (jenkins_job) {
              upstream_jobs_symlinks_obsolete[target] = true
              upstream_jobs_symlinks_adjusted[name] = name
            } else {
              jenkins_job = Jenkins.instance.getItemByFullName(target)
              // assert jenkins_job
              upstream_jobs_symlinks_obsolete[target] = false
            }

          }
          println("upstream_jobs_symlinks_adjusted:")
          println(upstream_jobs_symlinks_adjusted)
          println()
          println("upstream_jobs_symlinks_obsolete:")
          println(upstream_jobs_symlinks_obsolete)
          println()

          def upstream_jobs_current_builds = currentBuild.getUpstreamBuilds()
          def upstream_jobs_current_builds_only_not_obsolete = [: ]
          currentBuild.getBuildCauses('hudson.model.Cause$UpstreamCause').each() {
            def upstream_job_build_name = it["upstreamProject"];
            if (!upstream_jobs_symlinks_obsolete[upstream_job_build_name]) {
              upstream_jobs_current_builds_only_not_obsolete[upstream_job_build_name] = true
            }
          }
          println("upstream_jobs_current_builds_only_not_obsolete:")
          println(upstream_jobs_current_builds_only_not_obsolete)
          println()

          println("build causes: ")
          println(currentBuild.getBuildCauses())
          println()

          if (currentBuild.getBuildCauses('hudson.model.Cause$UpstreamCause').size() != 0) {
            SKIP = upstream_jobs_current_builds_only_not_obsolete.size() == 0 ? "true" : "false"
            println("upstream_jobs_current_builds.size: " + upstream_jobs_current_builds.size())
            println("upstream_jobs_current_builds_only_not_obsolete.size: " + upstream_jobs_current_builds_only_not_obsolete.size())
          } else {
            SKIP = "false"
          }

        }
      }
    }
    stage('Start') {
      when {
        equals expected: "false", actual: SKIP
      }
      steps {
        zulipSend(
          message: "Started build #${env.BUILD_NUMBER} of project ${env.JOB_NAME} (${env.BUILD_URL})",
          topic: "${env.JOB_NAME}")
      }
    }

    stage('Prepare artifacts') {
      when {
        equals expected: "false", actual: SKIP
      }
      steps {
        script {
          println(upstream_jobs_symlinks_adjusted)
          println(upstream_jobs_symlinks_adjusted["seqpipe/seqpipe-containers/${env.BRANCH_NAME}"])
        }
        sh 'rm -f build-env/"' + "${GITHUB_REPOSITORY_NAME}.combined-input.build-env.sh" + '"'
        copyArtifacts( filter: 'build-env/seqpipe-containers.build-env.sh', fingerprintArtifacts: true, projectName: upstream_jobs_symlinks_adjusted["seqpipe/seqpipe-containers/${env.BRANCH_NAME}"])
      }
    }

    stage('Generate stages') {
      when {
        equals expected: "false", actual: SKIP
      }
      steps {
        sh "./build.sh preset:slow build_no:${env.BUILD_NUMBER} stage:Jenkinsfile.generated-stages"
        script {
          load('Jenkinsfile.generated-stages')
        }
      }
    }

    stage('Postprocess build result') {
      when {
        equals expected: "true", actual: SKIP
      }
      steps {
        script {
          currentBuild.result = hudson.model.Result.NOT_BUILT.toString()
        }
      }
    }
  }
  post {
    success {
      // create artifact for output build env only if build is successful
      archiveArtifacts artifacts: "build-env/${GITHUB_REPOSITORY_NAME}.build-env.sh", fingerprint: true
    }
    always {
      // always create artifact for the combined input build env for use when debugging/recreating a build locally
      archiveArtifacts artifacts: "build-env/${GITHUB_REPOSITORY_NAME}.combined-input.build-env.sh", fingerprint: true
      zulipNotification(
        topic: "${env.JOB_NAME}"
      )
    }
  }
}
