import data from "../jsons/EmployeesData.json";
import React, { useState, useEffect } from "react";
import EmployeesItem from "../pages/EmployeesItem";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Employees = () => {
  const token = localStorage.getItem("token");
  const employees = useSelector((state) => state.employees);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: null,
    firstName: "",
    lastName: "",
    phone: "",
    hourlyRate: "",
  });
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEmployee = async (employeeId) => {
    if (employeeId) {
      const response = await fetch(
        `http://localhost:5000/employees/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      dispatch({ type: "DELETE_EMPLOYEE", payload: employeeId });
    }
  };

  const handleUpdateEmployee = async (updatedEmployee) => {
    if (updatedEmployee.id) {
      const response = await fetch(
        `http://localhost:5000/employees/${updatedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ updatedEmployee }),
        }
      );
      dispatch({ type: "UPDATE_EMPLOYEE", payload: updatedEmployee });
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/employees");
      const jsonData = await response.json();
      dispatch({ type: "SET_EMPLOYEES", payload: jsonData });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewEmployee({
      id: null,
      firstName: "",
      lastName: "",
      phone: "",
      hourlyRate: "",
    });
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
      console.log(newEmployee);
      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const employee = await response.json();

      dispatch({
        type: "ADD_EMPLOYEE",
        payload: employee,
      });

      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding employee:", error.message);
    }
  };

  return (
    <>
      <div className="equipmentPage-container">
        {employees.map((employee) => (
          <EmployeesItem
            key={employee.id}
            employee={employee}
            onDelete={handleDeleteEmployee}
            onUpdate={handleUpdateEmployee}
          />
        ))}
        <Button variant="success" className="mb-3" onClick={handleShowAddModal}>
          Добавить работника
        </Button>
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Добавить работника</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите имя"
                  value={newEmployee.firstName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      firstName: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите фамилию"
                  value={newEmployee.lastName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      lastName: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите номер телефона"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      phone: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Часовая оплата</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите часовую оплату"
                  value={newEmployee.hourlyRate}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      hourlyRate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Закрыть
            </Button>
            <Button variant="primary" onClick={handleAddEmployee}>
              Добавить работника
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Employees;
