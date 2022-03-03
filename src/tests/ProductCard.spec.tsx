import { fireEvent, render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import React from "react";
import { useState } from "react";
import { ProductCard } from '../components/ProductCard'


const product = 
  {
      name: "Bordado",
      id: '1',
      description: "Bordado de borboleta 23 cm",
      price: 80,
      quantity: 2,
      image: "https://img.elo7.com.br/product/original/35D9272/bordado-em-bastidor-borboleta-azul-bordado-livre.jpg",
  }


describe('ProductCard', () => {
  it('renders correctly', () => {
    const func = jest.fn();
    render(<ProductCard product={product} handleBuy={func} />)

      expect(screen.getByText(product.name)).toBeInTheDocument()
      expect(screen.getByText(product.description)).toBeInTheDocument()
      expect(screen.getByText(`R$ ${product.price},00`)).toBeInTheDocument()

    expect(screen.getByText('Comprar')).toBeInTheDocument();
  })

  it('quando apertar botão incrementar pra mais', () => {

    const mockBuy = jest.fn();
    const onClick = jest.fn();
    // const setStateMock = jest.fn();

    // const useStateMock: any = () => [0, setStateMock];
    // jest.mock('react', () => ({
    //   ...jest.requireActual('react'),
    //   useState: useStateMock
    // }));
    
    // render(<ProductCard product={product} handleBuy={mockBuy} />)

    // const increment = screen.getByText('+');
    // fireEvent.click(increment);

    // expect(increment).toBeInTheDocument();
    // expect(onClick).toHaveBeenCalled()
    // expect(setStateMock).toHaveBeenCalled();
  })

})