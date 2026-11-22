import React, { useEffect } from "react";
import { MdArrowOutward, MdClose } from "react-icons/md";
import "./styles/ProjectDetailsModal.css";

export interface ProjectDetail {
  title: string;
  category: string;
  tools: string;
  image: string;
  alt: string;
  link?: string;
  overview?: string;
  contribution?: string;
  features?: string[];
}

interface ModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const toolList = project.tools.split(",").map((t) => t.trim());

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <h3 id="modal-project-title">{project.title}</h3>
            <div className="modal-category">{project.category}</div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close project details"
          >
            <MdClose />
          </button>
        </div>

        <div className="modal-image-container">
          <img src={project.image} alt={project.alt} loading="lazy" decoding="async" />
        </div>

        <div className="modal-body">
          {project.overview && (
            <div>
              <h4>Overview & Purpose</h4>
              <p>{project.overview}</p>
            </div>
          )}

          {project.contribution && (
            <div>
              <h4>Role & Contribution</h4>
              <p>{project.contribution}</p>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div>
              <h4>Main Features & Workflow</h4>
              <ul style={{ margin: "0.25rem 0 0 1.25rem", padding: 0 }}>
                {project.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: "0.25rem" }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4>Technologies Used</h4>
            <div className="modal-tags">
              {toolList.map((tool, idx) => (
                <span key={idx} className="modal-tag">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link-btn"
            >
              View Repository <MdArrowOutward />
            </a>
          ) : (
            <button className="modal-link-btn secondary" onClick={onClose}>
              Close Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
