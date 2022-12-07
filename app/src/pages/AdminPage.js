import DashboardLayout from "../Layout/DashboardLayout"
import { useEffect, useState } from "react"
import apiStore from "../components/api-store"
import { useAuth } from "../components/auth-provider"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Navigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';

const AdminPage = () => {
  const { token, role } = useAuth()
  const [data, setData] = useState({})
  const [show, setShow] = useState('close')
  const [selectedUser, setSelectedUser] = useState(0)
  const openDeleteModal = (id) => {
    setSelectedUser(id)
    setShow('delete')
  }
  const closeModal = () => {
    setSelectedUser(0)
    setShow('close')
  }

  useEffect(() => {
    apiStore.getUsers(token, true)
      .then(res => setData(res))
      .catch()
  }, [token, show])

  if (role !== 'admin') return <Navigate to='/dashboard' />


  const onDelete = async (e) => {
    e.preventDefault()

    const res = await apiStore.deleteUser(selectedUser, token)

    if (res.error) return
  }

  const handleSelect = (e, row) => {
    apiStore.updateUser(row.id, token, {role: e})
      .then(res => window.location.reload())
      .catch()
  }
  const columns = [
    { dataField: "id", text: "id" },
    { dataField: "first_name", text: "First Name" },
    { dataField: "last_name", text: "Last Name" },
    { dataField: "email", text: "Email" },
    {
      dataField: "role", text: "Role", formatter: (_, row) => {
        const rowDropDown = ['basic', 'contributor']

        return (
          <DropdownButton
            variant="outline-secondary"
            title={row.role}
            id="input-group-dropdown-1"
            onSelect={(e) => handleSelect(e, row)}
          >
            {rowDropDown.map(item => (
              <Dropdown.Item key={item} eventKey={item}>{item}</Dropdown.Item>
            ))}
          </DropdownButton>
        )
      }
    },
    {
      dataField: "", text: "Remove", formatter: (_, row) => {
        return (
          <div className="w-50 text-center mx-auto">
            <Button className="btn-sm" variant="danger" onClick={() => openDeleteModal(row.id)}>Delete</Button>
          </div>
        )
      }
    }
  ]

  const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
  }];

  const { items, _meta } = data
  const pagination = _meta
    ? paginationFactory({
      page: _meta.page,
      sizePerPage: _meta.per_page,
      lastPageText: '>>',
      firstPageText: '<<',
      nextPageText: '>',
      prePageText: '<',
      showTotal: true,
      alwaysShowAllBtns: true,
      onPageChange: async function (page, sizePerPage) {
        const _data = await apiStore.getUsers(token, true, page, sizePerPage)
        setData(_data)
      },
      onSizePerPageChange: async function (sizePerPage, page) {
        const _data = await apiStore.getUsers(token, true, page, sizePerPage)
        setData(_data)
      }
    })
    : paginationFactory({
      page: 1,
      sizePerPage: 10,
      lastPageText: '>>',
      firstPageText: '<<',
      nextPageText: '>',
      prePageText: '<',
      showTotal: true,
      alwaysShowAllBtns: true,
      onPageChange: function (page, sizePerPage) { },
      onSizePerPageChange: function (page, sizePerPage) { }
    })

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <Modal show={show === 'delete'} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to delete this use?</h4>
            <Form onSubmit={onDelete}>
              <Button className="btn-sm" type="submit">Yes</Button>
              <Button className="btn-sm" variant="danger" onClick={() => closeModal()}>No</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {
          items && _meta
            ? <BootstrapTable bootstrap4 keyField="id" data={items} columns={columns} defaultSorted={defaultSorted} pagination={pagination} />
            : null
        }

      </div>
    </DashboardLayout>
  )
}

export default AdminPage
