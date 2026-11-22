import React from "react";
import { MdCode, MdAutoAwesome, MdBarChart, MdTerminal } from "react-icons/md";
import "./styles/TechStack.css";

interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Programming & Frameworks",
    icon: <MdCode />,
    skills: ["Python", "FastAPI", "Node.js", "HTML", "CSS", "Pydantic"],
  },
  {
    category: "AI & Generative AI",
    icon: <MdAutoAwesome />,
    skills: ["Generative AI", "LLMs", "RAG", "Prompt Engineering", "LangGraph", "AI Agents", "Qdrant"],
  },
  {
    category: "Data Analysis & BI",
    icon: <MdBarChart />,
    skills: ["SQL", "MySQL", "SQLite", "Data Analysis", "Data Cleaning", "EDA", "Power BI", "Tableau", "Excel"],
  },
  {
    category: "Core CS & Tools",
    icon: <MdTerminal />,
    skills: ["OOPS", "DBMS", "DSA", "Git", "GitHub", "Linux", "VS Code"],
  },
];

const TechStack: React.FC = () => {
  return (
    <section className="techstack-section" id="techstack">
      <h2>
        My <span>Techstack</span>
      </h2>
      <div className="techstack-grid">
        {skillCategories.map((group, idx) => (
          <div className="techstack-card" key={idx}>
            <div className="techstack-card-header">
              <span className="techstack-card-icon">{group.icon}</span>
              <h3>{group.category}</h3>
            </div>
            <div className="techstack-card-skills">
              {group.skills.map((skill, sIdx) => (
                <span className="techstack-pill" key={sIdx}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
