import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

interface Project {
    id?: number;
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
    const [project, setProject] = useState<Project>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        responsiblePerson: '',
        customerId: 0,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (show && initialData) {
            setProject({
                name: initialData.name || '',
                description: initialData.description || '',
                startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
                endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
                responsiblePerson: initialData.responsiblePerson || '',
                customerId: initialData.customerId || 0,
            });
        }
    }, [initialData, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!project.name) newErrors.name = 'Projektname ist erforderlich.';
        if (!project.description) newErrors.description = 'Projektbeschreibung ist erforderlich.';
        if (!project.startDate) newErrors.startDate = 'Startdatum ist erforderlich.';
        if (!project.endDate) newErrors.endDate = 'Enddatum ist erforderlich.';
        if (!project.responsiblePerson) newErrors.responsiblePerson = 'Verantwortliche Person ist erforderlich.';
        if (!project.customerId) newErrors.customerId = 'Kunden-ID ist erforderlich.';

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const currentDate = new Date().toISOString();

        const formattedProject: Project = {
            id: initialData.id || 0,
            name: project.name,
            description: project.description,
            startDate: project.startDate || currentDate,
            endDate: project.endDate || currentDate,
            responsiblePerson: project.responsiblePerson,
            customerId: project.customerId,
        };

        await onSubmit(formattedProject);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Projekt bearbeiten' : 'Projekt hinzufügen'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="danger">
                            Bitte füllen Sie alle Felder aus.
                        </Alert>
                    )}

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Projektname:</label>
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
                        <label htmlFor="description" className="form-label">Projektbeschreibung:</label>
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
                        <label htmlFor="startDate" className="form-label">Startdatum:</label>
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
                        <label htmlFor="endDate" className="form-label">Enddatum:</label>
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
                        <label htmlFor="responsiblePerson" className="form-label">Verantwortliche Person:</label>
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
                        <label htmlFor="customerId" className="form-label">Kunden-ID:</label>
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
                        {initialData.id ? 'Speichern' : 'Hinzufügen'}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default ProjectFormModal;
