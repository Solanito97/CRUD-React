import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowInventory = () => {
    const url = 'https://paginas-web-cr.com/ucr/multimedios0124/ApiBVJ/inventario/index.php';
    const [inventory, setInventory] = useState([]);
    const [idInventarios, setIdInventarios] = useState('');
    const [producto_id, setProductoId] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [creado_por, setCreadoPor] = useState('');
    const [modificado_por, setModificadoPor] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getInventory();
    }, []);

    const getInventory = async () => {
        const response = await axios.get(url);
        setInventory(response.data);
    }

    const openModal = (op, id, producto_id, cantidad, ubicacion, creado_por, modificado_por) => {
        setIdInventarios('');
        setProductoId('');
        setCantidad('');
        setUbicacion('');
        setCreadoPor('');
        setModificadoPor('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Inventario');
        } else if (op === 2) {
            setTitle('Editar Inventario');
            setIdInventarios(id);
            setProductoId(producto_id);
            setCantidad(cantidad);
            setUbicacion(ubicacion);
            setCreadoPor(creado_por);
            setModificadoPor(modificado_por);
        }
        window.setTimeout(() => {
            document.getElementById('producto_id').focus();
        }, 500);
    }

    const validar = () => {
        let parametros;
        let metodo;
        if (producto_id.trim() === '') {
            show_alerta('Escribe el ID del producto', 'warning');
        } else if (cantidad.trim() === '') {
            show_alerta('Escribe la cantidad', 'warning');
        } else if (ubicacion.trim() === '') {
            show_alerta('Escribe la ubicación', 'warning');
        } else {
            if (operation === 1) {
                parametros = {
                    producto_id: producto_id.trim(),
                    cantidad: cantidad.trim(),
                    ubicacion: ubicacion.trim(),
                    creado_por: creado_por,
                    modificado_por: modificado_por
                };
                metodo = 'POST';
            } else {
                parametros = {
                    idInventarios: idInventarios,
                    producto_id: producto_id.trim(),
                    cantidad: cantidad.trim(),
                    ubicacion: ubicacion.trim(),
                    creado_por: creado_por,
                    modificado_por: modificado_por
                };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros })
            .then(response => {
                const tipo = response.data[0];
                const msj = response.data[1];
                show_alerta(msj, tipo);
                if (tipo === 'success') {
                    document.getElementById('btnCerrar').click();
                    getInventory();
                }
            })
            .catch(error => {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteInventory = (idInventarios, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el inventario de ' + nombre + ' ?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setIdInventarios(idInventarios);
                axios.delete(url, { data: { idInventarios: idInventarios } })
                    .then(response => {
                        show_alerta('Inventario eliminado correctamente', 'success');
                        getInventory();
                    })
                    .catch(error => {
                        show_alerta('Error al eliminar el inventario', 'error');
                    });
            } else {
                show_alerta('El inventario NO fue eliminado', 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-5'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark mt-5' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>PRODUCTO ID</th><th>CANTIDAD</th><th>UBICACIÓN</th><th>CREADO POR</th><th>MODIFICADO POR</th><th>ACCIONES</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {inventory.map((item, i) => (
                                        <tr key={item.idInventarios}>
                                            <td>{(i + 1)}</td>
                                            <td>{item.producto_id}</td>
                                            <td>{item.cantidad}</td>
                                            <td>{item.ubicacion}</td>
                                            <td>{item.creado_por}</td>
                                            <td>{item.modificado_por}</td>
                                            <td>
                                                <button onClick={() => openModal(2, item.idInventarios, item.producto_id, item.cantidad, item.ubicacion, item.creado_por, item.modificado_por)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalInventory'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteInventory(item.idInventarios, item.ubicacion)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalInventory' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='idInventarios'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-box'></i></span>
                                <input type='text' id='producto_id' className='form-control' placeholder='ID del Producto' value={producto_id}
                                    onChange={(e) => setProductoId(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-sort-numeric-up-alt'></i></span>
                                <input type='text' id='cantidad' className='form-control' placeholder='Cantidad' value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-map-marker-alt'></i></span>
                                <input type='text' id='ubicacion' className='form-control' placeholder='Ubicación' value={ubicacion}
                                    onChange={(e) => setUbicacion(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='creado_por' className='form-control' placeholder='User id' value={creado_por}
                                    onChange={(e) => setCreadoPor(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-regular fa-user'></i></span>
                                <input type='text' id='modificado_por' className='form-control' placeholder='User id' value={modificado_por}
                                    onChange={(e) => setModificadoPor(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowInventory;
