import { useNavigate, useParams } from "react-router-dom";
import UnloggedLayout from "../layouts/UnloggedLayout";
import LoggedRoute from "./LoggedRoute";
import useOrder from "../hooks/useOrder";
import { useEffect, useState } from "react";
import { paths } from "../config/routes";
import OrderTemplate from "../components/templates/OrderTemplate";

function OrderBuyer() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const { getOrder, loading } = useOrder();

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrder(id, "bought");
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
            backTo={() => navigate(paths.buyerOrders)}
        />
      </UnloggedLayout>
    </LoggedRoute>
  );
}

export default OrderBuyer;