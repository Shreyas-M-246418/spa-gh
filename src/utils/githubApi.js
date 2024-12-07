const githubApi = {
    async getJobs() {
      // Public read - no token needed
      const response = await fetch(
        `https://raw.githubusercontent.com/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/main/${process.env.REACT_APP_JOBS_FILE_PATH}`
      );
      const content = await response.json();
      return content.jobs || [];
    },

    async createJob(job) {
      // Use repository_dispatch event without token
      const response = await fetch(
        `https://api.github.com/repos/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'add-job',
            client_payload: { job }
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      
      return { success: true, job };
    }
};

export default githubApi;