import styled from 'styled-components';
import { useState } from 'react';
import CreateCabinForm from './CreateCabinForm';
import { useDeleteCabin } from './useDeleteCabin';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import { Database } from '../../utils/database.types';
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
  const [showForm, setShowForm] = useState(false);
  const { id, image, name, maxCapacity, regularPrice, discount } = cabin;
  const { isPending, deleteCabin: mutate } = useDeleteCabin();

  return (
    <>
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
          <button onClick={() => setShowForm(s => !s)} disabled={isPending}>
            <HiPencil />
          </button>
          <button disabled={isPending} onClick={() => mutate(id)}>
            <HiTrash />
          </button>
        </div>
      </TableRow>
      {showForm && <CreateCabinForm cabinEdit={cabin} />}
    </>
  );
}
