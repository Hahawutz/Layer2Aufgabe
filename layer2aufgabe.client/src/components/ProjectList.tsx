import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProjectFormModal from './ProjectFormModal';

interface Customer {
    id: number;
    name: string;
    code: string;
    responsiblePerson: string;
    startDate: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    responsiblePerson: string;
    customer?: Customer;
}

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

    const fetchProjects = async () => {
        try {
            const response = await fetch('https://localhost:7073/api/Project');
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Projektliste');
            }
            const data: Project[] = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Fehler beim Laden der Projekte:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (project: Project | null = null) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    
    const addProject = async (newProject: Omit<Project, 'id'>) => {
        try {
            const response = await fetch('https://localhost:7073/api/Project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Hinzufügen des Projekts: ${response.statusText}`);
            }

            await fetchProjects();
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Projekts:', error);
        }
    };

    const updateProject = async (updatedProject: Project) => {
        try {
            const response = await fetch(`https://localhost:7073/api/Project/${updatedProject.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject),
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Aktualisieren des Projekts: ${response.statusText}`);
            }

            await fetchProjects();
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Projekts:', error);
        }
    };

    const deleteProject = async (projectId: number) => {
        try {
            const response = await fetch(`https://localhost:7073/api/Project/${projectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Löschen des Projekts: ${response.statusText}`);
            }

            await fetchProjects();
        } catch (error) {
            console.error('Fehler beim Löschen des Projekts:', error);
        }
    };

    const handleSubmit = async (project: Project) => {
        if (project.id) {
            await updateProject(project);
        } else {
            await addProject(project);
        }
        handleCloseModal();
    };

    const toggleCustomerDetails = (projectId: number) => {
        setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Projektliste</h2>
                <button
                    className="btn btn-success"
                    onClick={() => handleShowModal()}
                >
                    Projekt hinzufügen
                </button>
            </div>
            <div className="row">
                {projects.map((project) => (
                    <div key={project.id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{project.name}</h5>
                                <p className="card-text">
                                    <strong>Beschreibung:</strong> {project.description}<br />
                                    <strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}<br />
                                    <strong>Ende:</strong> {new Date(project.endDate).toLocaleDateString()}<br />
                                    <strong>Verantwortlich:</strong> {project.responsiblePerson}
                                </p>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => handleShowModal(project)}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteProject(project.id)}
                                        >
                                            Löschen
                                        </button>
                                    </div>
                                    {project.customer && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => toggleCustomerDetails(project.id)}
                                        >
                                            {expandedProjectId === project.id ? 'Kunde verbergen' : 'Kunde anzeigen'}
                                        </button>
                                    )}
                                </div>

                                {expandedProjectId === project.id && project.customer && (
                                    <div className="mt-3">
                                        <table className="table table-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Kunde</th>
                                                    <th>Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><strong>Name:</strong></td>
                                                    <td>{project.customer.name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Kürzel:</strong></td>
                                                    <td>{project.customer.code}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Verantwortlicher:</strong></td>
                                                    <td>{project.customer.responsiblePerson}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Kunde seit:</strong></td>
                                                    <td>{new Date(project.customer.startDate).toLocaleDateString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ProjectFormModal
                show={showModal}
                handleClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={selectedProject || {}}
            />
        </div>
    );
};

export default ProjectList;
