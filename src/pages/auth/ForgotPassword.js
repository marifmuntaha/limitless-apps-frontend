import React, {useEffect, useState} from "react";
import Logo from "../../images/limitless/logo.png";
import LogoDark from "../../images/limitless/logo-dark.png";
import Head from "../../layout/head";
import AuthFooter from "./AuthFooter";
import {Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard} from "../../components";
import {Link} from "react-router-dom";
import axios from "axios";
import handleError from "./handleError";
import {ToastContainer} from "react-toastify";
import {Spinner} from "reactstrap";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('1');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const handleCheckAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/auth/reset-password`, {
            step: '1',
            email: email
        }).then(resp => {
            setLoading(false);
            setStep('2');
        }).catch(error => {
            setLoading(false);
            setStep('1');
            handleError(error);
        });
    }
    const handleFormEmail = () => {
        return <>
            <form onSubmit={(e) => handleCheckAccount(e)}>
                <div className="form-group">
                    <div className="form-control-wrap">
                        <div className="input-group">
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                placeholder="Masukkan email anda"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <Button size="lg" className="btn-block" type="submit" color="primary">
                        {loading ? <Spinner size="sm" color="light"/> : "RESET SANDI"}
                    </Button>
                </div>
            </form>
        </>
    }
    const handleFormCode = () => {
        return <>
            <form onSubmit={(e) => handleCheckAccount(e)}>
                <div className="form-group">
                    <div className="form-control-wrap">
                        <div className="input-group">
                            <input
                                type="text"
                                name="code"
                                className="form-control"
                                placeholder="Masukkan kode"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <div className="input-group-append">
                                <Button
                                    outline
                                    color="primary"
                                    className="btn-dim"
                                    disabled={countdown !== 0}
                                >
                                  {countdown !== 0 ? countdown : "KIRIM KODE"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <Button type="submit" color="primary" size="lg" className="btn-block">VERIFIKASI</Button>
                </div>
            </form>
        </>
    }

    useEffect(() => {
     if (countdown > 0){
       setTimeout(() => {
         setCountdown(countdown - 1)
       }, 1000);
     }
     else {
       setCountdown(0);
     }
    }, [countdown])

    return (
        <>
            <Head title="Lupa Sandi"/>
            <ToastContainer/>
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
                            <BlockTitle tag="h5">Reset Sandi</BlockTitle>
                            <BlockDes>
                                <p>Jika Anda lupa kata sandi Anda, kami akan mengirimkan kode untuk mengatur ulang kata
                                    sandi Anda.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    {step === '1' ? (
                        handleFormEmail()
                    ) : (handleFormCode())}
                    <div className="form-note-s2 text-center pt-4">
                        <Link to={`${process.env.PUBLIC_URL}/masuk`}>
                            <strong>Halaman Masuk</strong>
                        </Link>
                    </div>
                </PreviewCard>
            </Block>
            <AuthFooter/>
        </>
    );
};
export default ForgotPassword;
