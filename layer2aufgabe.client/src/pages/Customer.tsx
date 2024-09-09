import React from 'react';
import CustomerList from '../components/CustomerList';
import useAutoLogout from '../hooks/useAutoLogout';

const Customers: React.FC = () => {
    useAutoLogout();

    return (
        <div className= "Customers" >
        < CustomerList />
        </div>
  );
};

export default Customers;
