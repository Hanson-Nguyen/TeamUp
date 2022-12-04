import DashboardLayout from "../Layout/DashboardLayout"
import { useEffect, useState } from "react"
import apiStore from "../components/api-store"
import { useAuth } from "../components/auth-provider"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { token, role } = useAuth()
  const [data, setData] = useState({})

  useEffect(() => {
    apiStore.getUsers(token, true)
    .then(res => setData(res))
    .catch()
  }, [token])

  if (role !== 'admin') return <Navigate to='/dashboard' />

  const columns = [
    { dataField: "id", text: "id" },
    { dataField: "first_name", text:"First Name" },
    { dataField: "last_name", text: "Last Name" },
    { dataField: "email", text: "Email"}
  ]

  const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
  }];

  const {items, _meta } = data
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
  :paginationFactory({
    page: 1,
    sizePerPage: 10,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {},
    onSizePerPageChange: function (page, sizePerPage) {}
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        {
          items && _meta
          ? <BootstrapTable bootstrap4 keyField="id" data={items} columns={columns} defaultSorted={defaultSorted} pagination={pagination}/>
          : null
        }

      </div>
    </DashboardLayout>
  )
}

export default AdminPage
