import OrderLayout from "../layouts/OrderLayout";

const ORDER_TYPE_BOUGHT = 'BOUGHT';

function OrdersBought() {
    return (
        <OrderLayout type={ORDER_TYPE_BOUGHT}/>
    );
}

export default OrdersBought;