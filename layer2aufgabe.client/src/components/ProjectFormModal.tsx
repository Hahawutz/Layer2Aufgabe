import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    responsiblePerson: string;
    customerId: number;
}

interface ProjectFormModalProps {
    show: boolean;
    handleClose: () => void;
    onSubmit: (project: Project) => Promise<void>;
    initialData?: Partial<Project>;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
    show,
    handleClose,
    onSubmit,
    initialData = {},
}) => {
    // Initial project state
    const [project, setProject] = useState<Project>({
        id: 0,
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        responsiblePerson: '',
        customerId: 0,
    });

    // State to store form validation errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    /**
     * useEffect to update the form with initialData when modal is shown.
     */
    useEffect(() => {
        if (show && initialData) {
            setProject({
                id: initialData.id || 0,
                name: initialData.name || '',
                description: initialData.description || '',
                startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
                endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
                responsiblePerson: initialData.responsiblePerson || '',
                customerId: initialData.customerId || 0,
            });
        }
    }, [initialData, show]);

    /**
     * Handles input changes and updates the project state.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };

    /**
     * Validates the form fields.
     * Returns an object with error messages for each invalid field.
     */
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!project.name) newErrors.name = 'Project name is required.';
        if (!project.description) newErrors.description = 'Project description is required.';
        if (!project.startDate) newErrors.startDate = 'Start date is required.';
        if (!project.endDate) newErrors.endDate = 'End date is required.';
        if (!project.responsiblePerson) newErrors.responsiblePerson = 'Responsible person is required.';
        if (!project.customerId) newErrors.customerId = 'Customer ID is required.';

        return newErrors;
    };

    /**
     * Handles form submission, performs validation and calls the onSubmit function.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form inputs
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const currentDate = new Date().toISOString();

        // Prepare the project object to be submitted
        const formattedProject: Project = {
            id: initialData.id || 0,
            name: project.name,
            description: project.description,
            startDate: project.startDate || currentDate,
            endDate: project.endDate || currentDate,
            responsiblePerson: project.responsiblePerson,
            customerId: project.customerId,
        };

        // Submit the project data
        await onSubmit(formattedProject);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Edit project' : 'Add project'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="danger">
                            Please fill in all fields.
                        </Alert>
                    )}

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Project name:</label>
                        <input
                            id="name"
                            name="name"
                            value={project.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Project description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="startDate" className="form-label">Start date:</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={project.startDate}
                            onChange={handleChange}
                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                        />
                        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="endDate" className="form-label">End date:</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={project.endDate}
                            onChange={handleChange}
                            className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                        />
                        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="responsiblePerson" className="form-label">Responsible person:</label>
                        <input
                            id="responsiblePerson"
                            name="responsiblePerson"
                            value={project.responsiblePerson}
                            onChange={handleChange}
                            className={`form-control ${errors.responsiblePerson ? 'is-invalid' : ''}`}
                        />
                        {errors.responsiblePerson && <div className="invalid-feedback">{errors.responsiblePerson}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="customerId" className="form-label">Customer ID:</label>
                        <input
                            id="customerId"
                            name="customerId"
                            value={project.customerId}
                            onChange={handleChange}
                            className={`form-control ${errors.customerId ? 'is-invalid' : ''}`}
                        />
                        {errors.customerId && <div className="invalid-feedback">{errors.customerId}</div>}
                    </div>

                    <Button variant="primary" type="submit">
                        {initialData.id ? 'Save' : 'Add'}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default ProjectFormModal;
