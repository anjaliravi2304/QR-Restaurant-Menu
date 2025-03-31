import React from "react";
import { Box, Button, Typography } from "@mui/material";
import withRouter from "../components/withRouter";
import BaseComponent from "../components/BaseComponent";
import CustomerMenuHeader from "./CustomerMenuHeader";
import CustomizedAccordions from "./CustomizedAccordions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import CustomerOrderStatus from "./CustomerOrderStatus";

class CustomerMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
            isOrderNCallWaiterDisabled: false,
        };
    }

    onOrderNCallWaiter = async (rows, orderData) => {
        // console.log(orderData);
        // console.log(this.props.params);

        this.setState({ isOrderNCallWaiterDisabled: true });

        // const orderConnect = [
        //     ...(orderData.flat(Infinity)), // Flattens nested arrays to any depth
        //     this.props.params,
        // ];

        try {
            const menuRef = doc(db, "table", this.props.params.id);
            await updateDoc(menuRef, {
                order_details: rows,
                bill_details: orderData,
                order_placed: true,
                order_confirmed: false
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
        return (
            <BaseComponent collectionName="table" render={this.renderTable} params={this.props.params} navigate={this.props.navigate} />
        );
    }
}

export default withRouter(CustomerMenu);