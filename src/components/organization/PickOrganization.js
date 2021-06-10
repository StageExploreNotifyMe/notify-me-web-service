import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import {useHistory} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";

const PickOrganizationToManage = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const org = JSON.parse(localStorage.getItem("organization"));
    if (org === null || org.id !== undefined) {
        history.replace("/organization");
    }

    async function fetchPageData() {
        try {
            let data = await getBase("/userorganization/user/" + localStorage.getItem("user.id"));
            setData(data.userOrganizations);
            setLoading(false);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch all the venues you are a part of',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchPageData();
    }, [loading]);

    function onOrgClick(userOrg) {
        localStorage.setItem("userorganization", JSON.stringify(userOrg));
        localStorage.setItem("organization", JSON.stringify(userOrg.organization));
        history.push("/organization");
    }

    const RenderOrgs = () => {
        if (loading) return <Spinner/>

        return data.map(ev => {
            return <div className="panel-block columns" key={ev.id}>
                <div className="column">{ev.organization.name}</div>
                <div className="column is-2">
                    <button className="button is-primary" onClick={() => onOrgClick(ev)}>Details</button>
                </div>
            </div>
        })
    }

    return <article className="container mt-2">
        <section className="level">
            <div className="level-left"><h2 className="title is-3 level-item">
                Please select which organization you'd like to see information on now:
            </h2></div>
        </section>
        <section className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Organizations</h2>
            </div>
            <RenderOrgs/>
        </section>
    </article>
};

export default PickOrganizationToManage;