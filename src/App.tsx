import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  interface Job {
    title: string;
    url: string;
    by: string;
    time: number;
  }
  const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0";
  const [JobIds, setJobIds] = useState<number[]>([]);
  const [currPage, setCurrPage] = useState(0);
  const [jobList, setJobList] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async () => {
    let jobIds = JobIds;
    setIsLoading(true);
    if (!JobIds.length) {
      const response = await fetch(`${API_ENDPOINT}/jobstories.json`);
      jobIds = await response.json();
      setJobIds(jobIds);
    }
    const requiredJobs = jobIds.slice(currPage * 6, (currPage + 1) * 6);
    const jobs = await Promise.all(
      requiredJobs.map((id) =>
        fetch(`${API_ENDPOINT}/item/${id}.json`).then((res) => res.json())
      )
    );
    setJobList([...jobList, ...jobs]);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchJobs();
  }, [currPage]);
  return (
    <div className="container">
      <div className="jobListContainer">
        {jobList.map((job, index) => {
          return (
            <div className="jobCard" key={index}>
              <a
                className={`jobTitle ${job?.url ? "" : "noLink"}`}
                href={job?.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {job?.title}
              </a>
              <span>By: {job?.by}</span>
              <span>
                on: {job?.time && new Date(job?.time).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
      {currPage * 6 < JobIds.length && (
        <button
          className="loadMore"
          onClick={() => setCurrPage(currPage + 1)}
          type="button"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default App;
