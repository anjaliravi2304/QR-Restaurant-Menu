import React from "react";
import withRouter from "../components/withRouter";
import BaseComponent from "../components/BaseComponent";
import CustomerMenuHeader from "./CustomerMenuHeader";
import CustomizedAccordions from "./CustomizedAccordions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import CustomerOrderStatus from "./CustomerOrderStatus";

class CustomerMenucopyb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOrderNCallWaiterDisabled: false,
        };
    }

    onOrderNCallWaiter = async (rows, orderData) => {
        // console.log(orderData);
        // console.log(this.props.params);

        this.setState({ isOrderNCallWaiterDisabled: true });

        try {
            const menuRef = doc(db, "table", this.props.params.id);
            await updateDoc(menuRef, {
                order_details: rows,
                bill_details: orderData,
                order_placed: true,
                order_confirmed: false,
            });

        } catch (error) {
            console.error("Error creating table:", error);
            this.setState({ isOrderNCallWaiterDisabled: false });
            alert("An error occurred while creating the table.");
        }
    }

    renderTable = (data) => {
        // console.log(data.table_id);
        // console.log(data.table_name);
        console.log(data.order_placed);

        return (
            <main className="customer-menu-page" ref={this.mainRef}>
                {/* {data.table_name} */}
                <CustomerMenuHeader tableName={data.table_name} />
                {
                    (this.state.isOrderNCallWaiterDisabled || data.order_placed) ?
                        <CustomerOrderStatus id={data.table_id} /> :
                        <CustomizedAccordions isOrderNCallWaiterDisabled={this.state.isOrderNCallWaiterDisabled} onOrderNCallWaiter={this.onOrderNCallWaiter} />
                }

            </main >

        );
    }

    render() {
        console.log(this.props.params);
        console.log(this.props.params.id);
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id'); // Get the 'id' parameter
        console.log(id);

        return (
            <BaseComponent collectionName="table" render={this.renderTable} params={id} navigate={this.props.navigate} />
        );
    }
}

export default withRouter(CustomerMenucopyb);