"""
Basic backend tests to verify pytest infrastructure works
"""

import pytest


def test_basic_infrastructure():
    """Test that pytest infrastructure is working"""
    assert True


def test_simple_math():
    """Test basic arithmetic"""
    assert 2 + 2 == 4
    assert 10 - 5 == 5


def test_string_operations():
    """Test string operations"""
    text = "Hello World"
    assert text.lower() == "hello world"
    assert len(text) == 11
    assert "World" in text


def test_list_operations():
    """Test list operations"""
    items = [1, 2, 3, 4, 5]
    assert len(items) == 5
    assert 3 in items
    assert items[0] == 1
