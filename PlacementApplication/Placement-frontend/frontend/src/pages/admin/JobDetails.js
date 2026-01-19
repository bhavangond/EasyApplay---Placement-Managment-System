import { useParams } from "react-router-dom";
import { uploadJD, getJobById } from "../../api/admin";
import { useState, useEffect } from "react";

export default function JobDetails() {
  const { id } = useParams();
  const [file, setFile] = useState();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem("token");
      const data = await getJobById(id, token);
      setJob(data);
    };
    fetchJob();
  }, [id]);

  const upload = async () => {
    const token = localStorage.getItem("token");
    await uploadJD(id, file, token);
    alert("Uploaded");
  };

  if (!job) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>Job Details #{id}</h2>

      <p><b>Company:</b> {job.companyName}</p>
      <p><b>Role:</b> {job.role}</p>
      <p><b>Drive Details:</b> {job.driveDetails}</p>
      <p><b>OA Timing:</b> {job.oaTiming}</p>
      <p><b>Interview Timing:</b> {job.interviewTiming}</p>
      <p><b>Deadline:</b> {job.deadline}</p>
      <p><b>Min CGPA:</b> {job.minCgpa}</p>
      <p><b>Allowed Branches:</b> {job.allowedBranches}</p>
      <p><b>Stipend:</b> {job.stipend}</p>

      <p><b>Job Description:</b>
        {job.jobDescriptionUrl ? (
          <a href={job.jobDescriptionUrl} target="_blank" rel="noreferrer">
            View JD
          </a>
        ) : (
          " Not Uploaded"
        )}
      </p>

      <hr />
      <h3>Upload Job Description (PDF)</h3>
      <input type="file" accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload JD</button>
    </div>
  );
}
