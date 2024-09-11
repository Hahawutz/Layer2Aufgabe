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

// Fetch the user's role from localStorage
const getRoleFromLocalStorage = () => {
    return localStorage.getItem('role');
};

// Fetch the JWT token from localStorage
const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
};

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

    const role = getRoleFromLocalStorage();
    const token = getTokenFromLocalStorage();

    // Fetch the list of projects from the API
    const fetchProjects = async () => {
        try {
            const response = await fetch('https://localhost:7073/api/Project', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error when retrieving the project list');
            }
            const data: Project[] = await response.json();
            setProjects(data); // Set the project list state
        } catch (error) {
            console.error('Error when retrieving the project list:', error);
        }
    };

    // Fetch projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // Close the modal
    const handleCloseModal = () => setShowModal(false);

    // Show the modal to add or edit a project
    const handleShowModal = (project: Project | null = null) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    // Add a new project
    const addProject = async (newProject: Omit<Project, 'id'>) => {
        try {
            const response = await fetch('https://localhost:7073/api/Project', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            if (!response.ok) {
                throw new Error(`Error when adding the project: ${response.statusText}`);
            }

            await fetchProjects(); // Refresh the project list
        } catch (error) {
            console.error('Error when adding the project:', error);
        }
    };

    // Update an existing project
    const updateProject = async (updatedProject: Project) => {
        try {
            const response = await fetch(`https://localhost:7073/api/Project/${updatedProject.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject),
            });

            if (!response.ok) {
                throw new Error(`Error when updating the project: ${response.statusText}`);
            }

            await fetchProjects(); // Refresh the project list
        } catch (error) {
            console.error('Error when updating the project:', error);
        }
    };

    // Delete a project
    const deleteProject = async (projectId: number) => {
        try {
            const response = await fetch(`https://localhost:7073/api/Project/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error when deleting the project: ${response.statusText}`);
            }

            await fetchProjects(); // Refresh the project list
        } catch (error) {
            console.error('Error when deleting the project:', error);
        }
    };

    // Handle form submission for adding or updating a project
    const handleSubmit = async (project: Project) => {
        if (project.id) {
            await updateProject(project);
        } else {
            await addProject(project);
        }
        handleCloseModal();
    };

    // Toggle displaying customer details for a project
    const toggleCustomerDetails = (projectId: number) => {
        setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Project list</h2>
                <p> Logged in as: {role}</p>
                {role !== 'Read' && (
                    <button
                        className="btn btn-success"
                        onClick={() => handleShowModal()}
                    >
                        Add Project
                    </button>
                )}
            </div>
            <div className="row">
                {projects.map((project) => (
                    <div key={project.id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{project.name}</h5>
                                <p className="card-text">
                                    <strong>Description:</strong> {project.description}<br />
                                    <strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}<br />
                                    <strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}<br />
                                    <strong>Responsible:</strong> {project.responsiblePerson}
                                </p>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        {role !== 'Read' && (
                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => handleShowModal(project)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {role === 'Admin' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteProject(project.id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    {project.customer && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => toggleCustomerDetails(project.id)}
                                        >
                                            {expandedProjectId === project.id ? 'Hide customer' : 'Show customer'}
                                        </button>
                                    )}
                                </div>

                                {expandedProjectId === project.id && project.customer && (
                                    <div className="mt-3">
                                        <table className="table table-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Customer</th>
                                                    <th>Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><strong>Name:</strong></td>
                                                    <td>{project.customer.name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Code:</strong></td>
                                                    <td>{project.customer.code}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Responsible:</strong></td>
                                                    <td>{project.customer.responsiblePerson}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Customer since:</strong></td>
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
