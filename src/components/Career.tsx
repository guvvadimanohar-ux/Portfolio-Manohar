import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Intermediate (MPC) - Marks: 906</h4>
                <h5>Ramappa Junior College, Telangana</h5>
              </div>
              <h3>2020 – 2022</h3>
            </div>
            <p>
              Completed Higher Secondary Education with specialization in Mathematics, Physics, and Chemistry (MPC).
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science & Engineering (CGPA: 7.84)</h4>
                <h5>SVS Group Of Institutions, Telangana</h5>
              </div>
              <h3>2022 – 2026</h3>
            </div>
            <p>
              Specializing in CS & Engineering with strong foundations in Core Subjects including OOPS, DBMS, and Data Structures & Algorithms (DSA).
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Analyst Intern (AI)</h4>
                <h5>Kulture Hire — Hyderabad</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Conducted research on Gen Z workplace expectations, deployed Google Forms surveys, performed data cleaning & EDA, authored MySQL queries, and built Power BI executive dashboards for retention strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
