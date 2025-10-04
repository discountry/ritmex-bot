"""
Pedersen hash implementation for StarkWare cryptography.

This module provides a full implementation of the Pedersen hash function
as specified by StarkWare, compatible with the reference implementation.
"""

from typing import List, Tuple, Union

# Handle both relative and absolute imports
try:
    from .constants import (
        FIELD_PRIME, ALPHA, BETA, N_ELEMENT_BITS_HASH,
        SHIFT_POINT, CONSTANT_POINTS
    )
except ImportError:
    from constants import (
        FIELD_PRIME, ALPHA, BETA, N_ELEMENT_BITS_HASH,
        SHIFT_POINT, CONSTANT_POINTS
    )


def _div_mod(n: int, m: int, p: int) -> int:
    """
    Calculate (n / m) mod p.
    
    Args:
        n: The numerator
        m: The denominator  
        p: The modulus
        
    Returns:
        int: The result of the division modulo p
    """
    return (n * pow(m, -1, p)) % p


def _ec_add(p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple[int, int]:
    """
    Add two points on the elliptic curve.
    
    Args:
        p1: The first point as (x, y) coordinates
        p2: The second point as (x, y) coordinates
        
    Returns:
        Tuple[int, int]: The resulting point as (x, y) coordinates
    """
    if p1[0] == p2[0]:
        if (p1[1] + p2[1]) % FIELD_PRIME == 0:
            # The points are negatives of each other, return the point at infinity
            # We represent the point at infinity as None, but this should never happen
            # in our use case, so we raise an exception instead
            raise ValueError("Points are negatives of each other")
        
        # The points are the same, so we're doubling
        return _ec_double(p1)
    
    # Calculate the slope
    slope = _div_mod(p2[1] - p1[1], p2[0] - p1[0], FIELD_PRIME)
    
    # Calculate the new point
    x3 = (slope * slope - p1[0] - p2[0]) % FIELD_PRIME
    y3 = (slope * (p1[0] - x3) - p1[1]) % FIELD_PRIME
    
    return (x3, y3)


def _ec_double(p: Tuple[int, int]) -> Tuple[int, int]:
    """
    Double a point on the elliptic curve.
    
    Args:
        p: The point to double as (x, y) coordinates
        
    Returns:
        Tuple[int, int]: The resulting point as (x, y) coordinates
    """
    # Calculate the slope
    slope = _div_mod(3 * p[0] * p[0] + ALPHA, 2 * p[1], FIELD_PRIME)
    
    # Calculate the new point
    x3 = (slope * slope - 2 * p[0]) % FIELD_PRIME
    y3 = (slope * (p[0] - x3) - p[1]) % FIELD_PRIME
    
    return (x3, y3)


def _ec_mult(m: int, p: Tuple[int, int]) -> Tuple[int, int]:
    """
    Multiply a point on the elliptic curve by a scalar.
    
    Args:
        m: The scalar
        p: The point as (x, y) coordinates
        
    Returns:
        Tuple[int, int]: The resulting point as (x, y) coordinates
    """
    if m == 0:
        raise ValueError("Cannot multiply by 0")
    
    if m == 1:
        return p
    
    if m % 2 == 0:
        return _ec_mult(m // 2, _ec_double(p))
    else:
        return _ec_add(p, _ec_mult(m - 1, p))


def pedersen_hash_as_point(*elements: int) -> Tuple[int, int]:
    """
    Calculate the Pedersen hash of a list of integers and return the full EC point.

    This is the full implementation following StarkWare's specification:
    For each element, iterate through its 252 bits and add corresponding
    constant points based on the bit values.

    Args:
        *elements: Variable number of integers to hash

    Returns:
        Tuple[int, int]: The resulting EC point as (x, y) coordinates

    Raises:
        ValueError: If any element is out of range or if there are insufficient constant points
    """
    # Start with the shift point
    point = tuple(SHIFT_POINT)

    for i, element in enumerate(elements):
        # Validate element is in valid range
        if not (0 <= element < FIELD_PRIME):
            raise ValueError(f"Element {element} is out of range [0, {FIELD_PRIME})")

        # Calculate the starting index for this element's constant points
        start_idx = 2 + i * N_ELEMENT_BITS_HASH

        # Check if we have enough constant points
        if start_idx + N_ELEMENT_BITS_HASH > len(CONSTANT_POINTS):
            raise ValueError(f"Insufficient constant points for element {i}. Need {start_idx + N_ELEMENT_BITS_HASH}, have {len(CONSTANT_POINTS)}")

        # Full implementation using all 252 bits
        for j in range(N_ELEMENT_BITS_HASH):
            pt = tuple(CONSTANT_POINTS[start_idx + j])

            # Check for unhashable input (same x coordinate)
            if point[0] == pt[0]:
                raise ValueError('Unhashable input: point collision detected')

            if element & 1:
                point = _ec_add(point, pt)
            element >>= 1

        # Ensure all bits have been processed
        if element != 0:
            raise ValueError(f"Element too large: remaining bits {element}")

    return point


def pedersen_hash(*elements: int) -> int:
    """
    Calculate the Pedersen hash of a list of integers.
    
    This function returns only the x-coordinate of the resulting EC point,
    which is the standard Pedersen hash value.
    
    Args:
        *elements: Variable number of integers to hash
        
    Returns:
        int: The Pedersen hash as an integer (x-coordinate of the EC point)
        
    Raises:
        ValueError: If any element is out of range
    """
    point = pedersen_hash_as_point(*elements)
    return point[0]


def pedersen_hash_bytes(*elements: Union[int, bytes]) -> bytes:
    """
    Calculate the Pedersen hash and return as bytes.
    
    Args:
        *elements: Variable number of integers or bytes to hash
        
    Returns:
        bytes: The hash result as 32 bytes (big-endian)
        
    Raises:
        ValueError: If any element is invalid
    """
    # Convert bytes to integers if needed
    int_elements = []
    for element in elements:
        if isinstance(element, bytes):
            if len(element) > 32:
                raise ValueError(f"Bytes element too long: {len(element)} > 32")
            int_elements.append(int.from_bytes(element, byteorder='big'))
        elif isinstance(element, int):
            int_elements.append(element)
        else:
            raise ValueError(f"Invalid element type: {type(element)}")
    
    hash_result = pedersen_hash(*int_elements)
    return hash_result.to_bytes(32, byteorder='big')
