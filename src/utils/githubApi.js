const githubApi = {
    async getJobs() {
      // Using raw.githubusercontent.com for public reads
      const response = await fetch(
        `https://raw.githubusercontent.com/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/main/${process.env.REACT_APP_JOBS_FILE_PATH}`
      );
      const content = await response.json();
      return content.jobs || [];
    },

    async createJob(job) {
      // Create a dispatch event to the backend
      const response = await fetch(
        `https://api.github.com/repos/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('github_token')}`,
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