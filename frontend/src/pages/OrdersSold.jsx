import OrderLayout from "../layouts/OrderLayout";

const TYPE_ORDER_SOLD = 'SOLD';

function OrdersSold() {
    return (
        <OrderLayout type={TYPE_ORDER_SOLD}/>
    );
}

export default OrdersSold;