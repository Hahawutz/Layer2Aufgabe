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
}

interface Customer {
    id: number;
    name: string;
    code: string;
    responsiblePerson: string;
    startDate: string;
    projects: Project[];
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
    // Customer state for form fields
    const [customer, setCustomer] = useState<Customer>({
        id: 0,
        name: '',
        code: '',
        responsiblePerson: '',
        startDate: '',
        projects: []
    });

    // State for validation errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    /**
     * useEffect hook to set the form fields based on initialData.
     * This runs when the modal is opened (show is true) or initialData changes.
     */
    useEffect(() => {
        if (show && initialData?.id) {
            // Set form with initial customer data for editing
            setCustomer({
                id: initialData.id || 0,
                name: initialData.name || '',
                code: initialData.code || '',
                responsiblePerson: initialData.responsiblePerson || '',
                startDate: initialData.startDate || '',
                projects: initialData.projects || []
            });
        } else if (show && !initialData?.id) {
            // Reset form when adding a new customer
            setCustomer({
                id: 0,
                name: '',
                code: '',
                responsiblePerson: '',
                startDate: '',
                projects: []
            });
        }
    }, [initialData, show]);

    /**
     * Handles input changes in the form.
     * Updates the corresponding state value based on the field name.
     * 
     * @param e - The input change event
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    /**
     * Validates the form fields.
     * Checks if all required fields are filled.
     * 
     * @returns An object containing error messages for each invalid field
     */
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!customer.name) newErrors.name = 'Customer name is required';
        if (!customer.code) newErrors.code = 'Customer code is required';
        if (!customer.responsiblePerson) newErrors.responsiblePerson = 'Customer responsible person is required';
        if (!customer.startDate) newErrors.startDate = 'Start date is required';

        return newErrors;
    };

    /**
 * Formats the date using the local timezone.
 * 
 * @param date - The date string to be formatted
 * @returns The date
 */
    const getDateFormat = (date: string) => {
        const dateObj = new Date(date);
        const tzOffset = dateObj.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, -1); // Remove the "Z" at the end
        return localISOTime;
    };


    /**
     * Handles the form submission.
     * Validates the form, formats the data, and calls the onSubmit callback.
     * 
     * @param e - The form submit event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form fields
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Prepare the customer data to be submitted
        const formattedCustomer: Customer = {
            id: customer.id,
            name: customer.name,
            code: customer.code,
            responsiblePerson: customer.responsiblePerson,
            startDate: getDateFormat(customer.startDate),
            projects: customer.projects,
        };

        // Submit the customer data
        await onSubmit(formattedCustomer);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData?.id ? 'Edit customer' : 'Add customer'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="danger">
                            Please fill in all fields.
                        </Alert>
                    )}

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Customer name:</label>
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
                        <label htmlFor="code" className="form-label">Code:</label>
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
                        <label htmlFor="responsiblePerson" className="form-label">Responsible person:</label>
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
                        <label htmlFor="startDate" className="form-label">Customer since:</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={customer.startDate.split('T')[0]}
                            onChange={handleChange}
                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                        />
                        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                    </div>

                    <Button variant="primary" type="submit">
                        {initialData?.id ? 'Save' : 'Add'}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default CustomerFormModal;
