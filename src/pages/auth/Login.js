import React, {useState} from "react";
import Logo from "../../images/limitless/logo.png";
import LogoDark from "../../images/limitless/logo-dark.png";
import Head from "../../layout/head";
import AuthFooter from "./AuthFooter";
import {
    Block,
    BlockContent,
    BlockDes,
    BlockHead,
    BlockTitle,
    Button,
    Icon,
    PreviewCard, toastSuccess,
} from "../../components";
import {Form, Spinner} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import handleError from "./handleError";
import {ToastContainer} from "react-toastify";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [passState, setPassState] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleInputForm = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/auth/login`, formData)
            .then(resp => {
                setLoading(false);
                localStorage.setItem('token', resp.data.result.token);
                toastSuccess('Berhasil masuk, anda akan dialihkan dalam 2 detik')
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            })
            .catch(error => {
                handleError(error);
                setLoading(false);
            });
    }
    return <>
        <Head title="Masuk"/>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
                <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
                    <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo"/>
                    <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark"/>
                </Link>
            </div>
            <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                <BlockHead>
                    <BlockContent>
                        <BlockTitle tag="h4">Masuk</BlockTitle>
                        <BlockDes>
                            <p>Masuk ke aplikasi menggunakan email & kata sandi anda.</p>
                        </BlockDes>
                    </BlockContent>
                </BlockHead>
                <Form
                    className="is-alter" onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <div className="form-label-group">
                            <label className="form-label" htmlFor="email">
                                Alamat Email
                            </label>
                        </div>
                        <div className="form-control-wrap">
                            <input
                                type="text"
                                name="email"
                                placeholder="Masukkan alamat email anda"
                                className="form-control-lg form-control"
                                onChange={(e) => handleInputForm(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-label-group">
                            <label className="form-label" htmlFor="password">
                                Kata Sandi
                            </label>
                            <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/reset-sandi`}>
                                Lupa Sandi?
                            </Link>
                        </div>
                        <div className="form-control-wrap">
                            <a
                                href="#password"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    setPassState(!passState);
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                            >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>
                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                            </a>
                            <input
                                type={passState ? "text" : "password"}
                                className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                                name="password"
                                placeholder="Masukkan Kata Sandi anda"
                                onChange={(e) => handleInputForm(e)}

                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button size="lg" className="btn-block" type="submit" color="primary">
                            {loading ? <Spinner size="sm" color="light"/> : "MASUK"}
                        </Button>
                    </div>
                </Form>
                <div className="form-note-s2 text-center pt-4">
                    Belum punya akun? <Link to={`${process.env.PUBLIC_URL}/pendaftaran`}>Buat Akun</Link>
                </div>
            </PreviewCard>
            <ToastContainer/>
        </Block>
        <AuthFooter/>
    </>;
};
export default Login;
