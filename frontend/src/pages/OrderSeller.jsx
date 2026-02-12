import { useNavigate, useParams } from "react-router-dom";
import UnloggedLayout from "../layouts/UnloggedLayout";
import LoggedRoute from "./LoggedRoute";
import { useEffect, useState } from "react";
import useOrder from "../hooks/useOrder";
import OrderTemplate from "../components/templates/OrderTemplate";
import { paths } from "../config/routes";

function OrderSeller() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();
    const { getOrder, loading } = useOrder();

    useEffect(() => {
        const fetchOrder = async () => {
            const result = await getOrder(id, "sold");
            setOrder(result);
        };

        fetchOrder();
    }, [getOrder, id]);

    return (
        <LoggedRoute>
            <UnloggedLayout>
                <OrderTemplate
                    order={order}
                    loading={loading}
                    backTo={() => navigate(paths.sellerOrders)}
                />
            </UnloggedLayout>
        </LoggedRoute>
    );
}

export default OrderSeller;