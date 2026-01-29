import Button from "../../common/Button";
import AddressItem from "./AddressItem";
import "./AddressList.css";

const AddressList = ({
  addresses,
  selectedAddress,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="address-list">
      <div className="address-list-header">
        <h3>Direcciones de Envío</h3>
        <Button onClick={onAdd}>Agregar Nueva Dirección</Button>
      </div>
      <div className="address-list-content">
        {addresses.map((address) => (
          <AddressItem
            key={address.id || address.name}
            address={address}
            isSelected={selectedAddress?.id === address.id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AddressList;
