<?php
/**
 *  --- sample test 
 */

class myClass{

	private $int = 13;
	private $float = 3.14;

	public function __construct( $data ){
		$this -> name = isset( $data['name'] ) ? $data['name'] : '';
		$this -> age = isset( $data['age'] ) ? $data['age'] : 0;
		$this -> sex = isset( $data['sex'] ) ? $data['sex'] : 'M';
	}

	public function getName(){
		return $this -> name;
	}

	public function setName($name){
		$this -> name = $name;
	}

	public function getAge(){
		return $this -> age;
	}

	public function setAge($age){
		$this -> age = $age;
	}

	public function getSex(){
		return $this -> sex;
	}

	public function setSex($sex){
		$this -> sex = $sex;
	}

}