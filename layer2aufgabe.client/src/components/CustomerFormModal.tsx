import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

interface Customer {
    id?: number;
    name: string;
    code: string;
    responsiblePerson: string;
    startDate: string;
}

interface CustomerFormModalProps {
    show: boolean;
    handleClose: () => void;
    onSubmit: (customer: Customer) => Promise<void>;
    initialData?: Partial<Customer>;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
    show,
    handleClose,
    onSubmit,
    initialData = {},
}) => {
    const [customer, setCustomer] = useState<Customer>({
        name: '',
        code: '',
        responsiblePerson: '',
        startDate: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (show && initialData?.id) {
            setCustomer({
                name: initialData.name || '',
                code: initialData.code || '',
                responsiblePerson: initialData.responsiblePerson || '',
                startDate: initialData.startDate || ''
            });
        } else if (show && !initialData?.id) {
            setCustomer({
                name: '',
                code: '',
                responsiblePerson: '',
                startDate: ''
            });
        }
    }, [initialData, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!customer.name) newErrors.name = 'Kundenname ist erforderlich.';
        if (!customer.code) newErrors.code = 'Kundenk&#252;rzel ist erforderlich.';
        if (!customer.responsiblePerson) newErrors.responsiblePerson = 'Kundenverantwortlicher ist erforderlich.';
        if (!customer.startDate) newErrors.startDate = 'Startdatum ist erforderlich.';

        return newErrors;
    };

    const getISO8601Format = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toISOString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formattedCustomer: Customer = {
            id: initialData.id || undefined,
            name: customer.name,
            code: customer.code,
            responsiblePerson: customer.responsiblePerson,
            startDate: getISO8601Format(customer.startDate),
        };

        await onSubmit(formattedCustomer);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData?.id ? 'Kunden bearbeiten' : 'Kunden hinzuf&#252;gen'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="danger">
                            Bitte f&#252;llen Sie alle Felder aus.
                        </Alert>
                    )}

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Kundenname:</label>
                        <input
                            id="name"
                            name="name"
                            value={customer.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="code" className="form-label">Kundenk&#252;rzel:</label>
                        <input
                            id="code"
                            name="code"
                            value={customer.code}
                            onChange={handleChange}
                            className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="responsiblePerson" className="form-label">Kundenverantwortlicher:</label>
                        <input
                            id="responsiblePerson"
                            name="responsiblePerson"
                            value={customer.responsiblePerson}
                            onChange={handleChange}
                            className={`form-control ${errors.responsiblePerson ? 'is-invalid' : ''}`}
                        />
                        {errors.responsiblePerson && <div className="invalid-feedback">{errors.responsiblePerson}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="startDate" className="form-label">Kunde seit:</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={customer.startDate.split('T')[0]} // Nur das Datum anzeigen
                            onChange={handleChange}
                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                        />
                        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                    </div>

                    <Button variant="primary" type="submit">
                        {initialData?.id ? 'Speichern' : 'Hinzuf&#252;gen'}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default CustomerFormModal;
