import { useEffect, useState } from "react";

import DashboardLayout from "../Layout/DashboardLayout";
import "../css/class/create-class.scss";
import { useAuth } from "../components/auth-provider";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import apiStore from "../components/api-store";
import ProjectModal from "../components/project-modal";

const SearchClass = () => {
  const { token, role } = useAuth()
  const [data, setData] = useState({})
  const [show, setShow] = useState("close")
  const [projectToEdit, setProjectToEdit] = useState(0)
  const openCreateModal = () => setShow('create')
  const openEditModal = (id) => {
    setProjectToEdit(id)
    setShow('edit')
  }
  const closeModal = () => {
    setProjectToEdit(0)
    setShow('close')
  }

  useEffect(() => {
    apiStore.getProjects(token, true)
      .then(res => setData(res))
      .catch()
  }, [token, show])

  const columns = [
    { dataField: "id", text: "id" },
    { dataField: "name", text: "Project Title" },
    { dataField: "size", text: "Size" },
    {
      dataField: "published", text: "Published", formatter: (val) => {
        if (val) {
          return (
            <div className="w-50 bg-success mx-auto text-center rounded text-white">Published</div>
          )
        } else {
          return (
            <div className="w-50 bg-danger mx-auto text-center rounded text-white">X</div>
          )
        }
      }
    },
    {
      dataField: "", text: 'configure', formatter: (_, row) => {
        console.log('test', row)
        return (
          <div className="w-50 text-center mx-auto">
            <Button className="btn-sm" variant="primary" onClick={() => openEditModal(row.id)}>
              Edit
            </Button>
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
        const _data = await apiStore.getProjects(token, true, page, sizePerPage)
        setData(_data)
      },
      onSizePerPageChange: async function (sizePerPage, page) {
        const _data = await apiStore.getProjects(token, true, page, sizePerPage)
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
    <>
      <DashboardLayout>
        <div className="container mx-auto">
          <Button className="mb-2" variant="primary" onClick={openCreateModal}>
            Create Project
          </Button>

          <Modal show={show === 'create'} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProjectModal />
            </Modal.Body>
          </Modal>

          <Modal show={show === 'edit' } onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProjectModal edit={projectToEdit} />
            </Modal.Body>
          </Modal>
          {
            items && _meta
              ? <BootstrapTable bootstrap4 keyField="id" data={items} columns={columns} defaultSorted={defaultSorted} pagination={pagination} />
              : null
          }
        </div>

      </DashboardLayout>
    </>
  );
};
export default SearchClass;
