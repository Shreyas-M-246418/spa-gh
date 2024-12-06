const githubApi = {
    async getJobs() {
      const response = await fetch(
        `https://api.github.com/repos/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/contents/${process.env.REACT_APP_JOBS_FILE_PATH}`,
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_REPO_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const data = await response.json();
      const content = JSON.parse(Buffer.from(data.content, "base64").toString());
      return content.jobs || [];
    },
  
    async createJob(job) {
      const response = await fetch(
        `https://api.github.com/repos/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/contents/${process.env.REACT_APP_JOBS_FILE_PATH}`,
        {
          headers: {
            Authorization: `token ${process.env.REACT_APP_REPO_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
  
      const fileData = await response.json();
      const currentContent = JSON.parse(Buffer.from(fileData.content, "base64").toString());
  
      const updatedContent = {
        jobs: [...(currentContent.jobs || []), job],
      };
  
      await fetch(
        `https://api.github.com/repos/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/contents/${process.env.REACT_APP_JOBS_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${process.env.REACT_APP_REPO_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Add new job",
            content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString("base64"),
            sha: fileData.sha,
          }),
        }
      );
  
      return { success: true, job };
    }
  };
  
  export default githubApi;