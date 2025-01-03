import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import styled from 'styled-components';
import Modal from '../../ui/Modal';
import { Database } from '../../utils/database.types';
import CreateCabinForm from './CreateCabinForm';
import { useDeleteCabin } from './useDeleteCabin';
import ConfirmDelete from '../../ui/ConfirmDelete';
type Cabin = Database['public']['Tables']['cabins']['Row'];
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;
const Capacity = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

interface CabinRowProps {
  cabin: Cabin;
}

export default function CabinRow({ cabin }: CabinRowProps) {
  const { id, image, name, maxCapacity, regularPrice, discount } = cabin;
  const { isPending, deleteCabin: mutate } = useDeleteCabin();

  return (
    <TableRow role='row'>
      <Img src={image as unknown as string} />
      <Cabin>{name}</Cabin>
      <Capacity>{maxCapacity}</Capacity>
      <Price>${regularPrice}</Price>
      {discount ? <Discount>{discount}%</Discount> : <span>&mdash;</span>}
      <div>
        <button>
          <HiSquare2Stack />
        </button>

        <Modal>
          <Modal.Open opens='edit-form'>
            <button disabled={isPending}>
              <HiPencil />
            </button>
          </Modal.Open>
          <Modal.Window name='edit-form'>
            <CreateCabinForm cabinEdit={cabin} />
          </Modal.Window>
          <Modal.Open opens='confirm-delete'>
          <button disabled={isPending}>
            <HiTrash />
          </button>

          </Modal.Open>
          <Modal.Window name='confirm-delete'>
            <ConfirmDelete resourceName='cabin' onConfirm={() => mutate(id)} disabled={isPending} />
          </Modal.Window>
        </Modal>
      </div>
    </TableRow>
  );
}
