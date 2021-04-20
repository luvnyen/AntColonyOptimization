#include <iostream>
#include <Windows.h>
#include <Math.h>
#include <string.h>
#include <vector>
#include <string>
#include <time.h>
#define hiddenMessage cout << " /$$$$$$       /$$        /$$$$$$  /$$    /$$ /$$$$$$$$        /$$$$$$  /$$$$$$$ " << endl;cout << "|_  $$_/      | $$       /$$__  $$| $$   | $$| $$_____/       /$$__  $$| $$__  $$" << endl;cout << "  | $$        | $$      | $$  \\ $$| $$   | $$| $$            | $$  \\ $$| $$  \\ $$" << endl;cout << "  | $$        | $$      | $$  | $$|  $$ / $$/| $$$$$         | $$$$$$$$| $$$$$$$/" << endl;cout << "  | $$        | $$      | $$  | $$ \\  $$ $$/ | $$__/         | $$__  $$| $$____/ " << endl;cout << "  | $$        | $$      | $$  | $$  \\  $$$/  | $$            | $$  | $$| $$      " << endl;cout << " /$$$$$$      | $$$$$$$$|  $$$$$$/   \\  $/   | $$$$$$$$      | $$  | $$| $$      " << endl;cout << "|______/      |________/ \\______/     \\_/    |________/      |__/  |__/|__/      " << endl << endl;

using namespace std;

class Address {
private:
	float x, y;
	int pheromone;
	bool status;
	string name;

public :
	Address(float x = 0, float y = 0, int pheromone = 1, bool status = 0, string name = "ADDRESSNAME") {
		this->x = x;
		this->y = y;
		this->pheromone = pheromone;
		this->status = status;
		this->name = name;
	}
	~Address() {

	}

	// PAM
	float getOrdinat() {
		return this->x;
	}
	float getAbsis() {
		return this->y;
	}
	string getName() {
		return this->name;
	}

	void editAttribute(float x, float y, string name) {
		this->x = x;
		this->y = y;
		this->name = name;
	}
	void displayAddress() {
		cout << this->name << " (" << this->x << ", " << this->y << ")" << endl;
	}
};

float euclideanDistance(float x, float y, float a, float b) {
	return sqrt(pow(x - a, 2) + pow(y - b, 2));
}

class Ant {
private:
	vector<int> travelledAddress;
public:
	// PAM
	int getCurrentAddress() {
		return travelledAddress.back();
	}
	int getStartingAddress() {
		return travelledAddress.front();
	}

	void clearTravelledAddress() {
		travelledAddress.clear();
	}
	bool samePath(int origin_address, int destination_address) {
		for (int i = 0; i < travelledAddress.size(); i++)
		{
			if (travelledAddress[i] == origin_address && travelledAddress[i + 1] == destination_address) {
				return true;
			}
		}
		return false;
	}
	void addTravelledAddress(int index) {
		this->travelledAddress.push_back(index);
	}
	bool checkTravelledAddress(int index) {
		for (int i = 0; i < this->travelledAddress.size(); i++)
		{
			if (this->travelledAddress[i] == index) {
				return true;
			}
		}
		return false;
	}
	void displayCurrentAddress(vector<Address> address) {
		cout << address[travelledAddress.back()].getName();
	}
	float getTotalCost(vector<Address> address) {
		float totalCost = 0;
		for (int i = 0; i < travelledAddress.size(); i++)
		{
			totalCost += euclideanDistance(address[i].getOrdinat(), address[i].getAbsis(), address[i + 1].getOrdinat(), address[i + 1].getAbsis());
		}
		return totalCost;
	}
};

void displayAddress(vector<Address>& address) {
	for (int i = 0; i < address.size(); i++)
	{
		cout << i + 1 << ". "; address[i].displayAddress();
	}
}

void editAddress(vector<Address>& address) {
	cout << "Menu: EDIT ADDRESS\n\n";

	displayAddress(address);
	cout << "\nPlease choose a number = ";
	int number; cin >> number;

	system("CLS");

	cout << "Current ordinat (x) = " << address[number - 1].getOrdinat();
	cout << "\nCurrent absis (y) = " << address[number - 1].getAbsis();
	cout << "\nCurrent address name = " << address[number - 1].getName();

	cout << "\n\nEDIT ADDRESS";
	cout << "\nInput a new ordinat (x) = ";
	float x; cin >> x;
	cout << "Input a new ordinat (y) = ";
	float y; cin >> y;
	cout << "Input a new address name = ";
	cin.ignore();
	string name; getline(cin, name);

	address[number - 1].editAttribute(x, y, name);
}

void addAddress(vector<Address>& address) {
	cout << "Menu: ADD ADDRESS\n\n";

	cout << "Input ordinat (x) = ";
	float x; cin >> x;
	cout << "Input ordinat (y) = ";
	float y; cin >> y;
	cout << "Input address name = ";
	cin.ignore();
	string name; getline(cin, name);

	address.push_back(Address(x, y, 1, false, name));
}

void removeAddress(vector<Address>& address) {
	cout << "Menu: REMOVE ADDRESS\n\n";

	displayAddress(address);
	cout << "\nPlease choose a number = ";
	int number; cin >> number;

	address.erase(address.begin() + number - 1);
	displayAddress(address);
}

void addressInitialization(vector<Address>& address) {
	address.push_back(Address(-4, 4, 1, false, "A"));
	address.push_back(Address(16, -5, 1, false, "B"));
	address.push_back(Address(22, 8, 1, false, "C"));
	address.push_back(Address(0, -16, 1, false, "D"));
	address.push_back(Address(3, -19, 1, false, "E"));
	address.push_back(Address(24, -20, 1, false, "F"));
	address.push_back(Address(24, -15, 1, false, "G"));
	address.push_back(Address(16, -1, 1, false, "H"));
	address.push_back(Address(10, -15, 1, false, "I"));
	address.push_back(Address(-7, -2, 1, false, "J"));
	address.push_back(Address(13, 10, 1, false, "K"));
	address.push_back(Address(17, -6, 1, false, "L"));
	address.push_back(Address(19, 1, 1, false, "M"));
	address.push_back(Address(19, -16, 1, false, "N"));
	address.push_back(Address(-8, -8, 1, false, "O"));
	address.push_back(Address(-4, -1, 1, false, "P"));
	address.push_back(Address(20, -3, 1, false, "Q"));
	address.push_back(Address(17, -17, 1, false, "R"));
	address.push_back(Address(-2, 9, 1, false, "S"));
	address.push_back(Address(23, -24, 1, false, "T"));
	address.push_back(Address(31, -26, 1, false, "U"));
	address.push_back(Address(37, -20, 1, false, "V"));
	address.push_back(Address(30, -30, 1, false, "W"));
	address.push_back(Address(26, -22, 1, false, "X"));
	address.push_back(Address(37, -16, 1, false, "Y"));
	address.push_back(Address(25, -18, 1, false, "Z"));
	address.push_back(Address(17, -30, 1, false, "AA"));
	address.push_back(Address(26, -28, 1, false, "AB"));
	address.push_back(Address(27, -15, 1, false, "AC"));
	address.push_back(Address(18, -24, 1, false, "AD"));
}

void antInitialization(vector<Address>& address, vector<Ant>& ants) {
	Ant newAnt;
	// menaruh semut di tiap address
	for (int i = 0; i < address.size(); i++)
	{
		ants.push_back(newAnt);
		ants[i].addTravelledAddress(i);
	}
}

void displayAntsCurrentLocation(vector<Ant> ants, vector<Address> address, int index) {
	ants[index].displayCurrentAddress(address);
}

void initializePheromoneMatrix(vector<Address> address, vector<vector<int>>& pheromoneMatrix) {
	for (int i = 0; i < address.size(); i++) {
		vector<int> temp;
		for (int j = 0; j < address.size(); j++) {
			if (i != j) {
				temp.push_back(1);
			}
			else {
				temp.push_back(0);
			}
			cout << "[" << temp[j] << "]";
		}
		pheromoneMatrix.push_back(temp);
		cout << endl;
	}
}

float samePathCost(int x, int y, vector<Ant> ants, vector<Address> address) {
	float totalCost = 0;
	for (int i = 0; i < ants.size(); i++)
	{
		if (ants[i].samePath(x, y) == true) {
			totalCost += (1 / ants[i].getTotalCost(address));
		}
	}
	return totalCost;
}

void updatePheromoneMatrix(vector<vector<int>>& pheromoneMatrix, vector<Address> address, float evaporate, vector<Ant> ants) {
	float temp_pheromone;
	for (int y = 0; y < pheromoneMatrix.size(); y++) {
		for (int z = 0; z < pheromoneMatrix.size(); z++) {
			if (y != z) {
				temp_pheromone = evaporate * pheromoneMatrix[y][z] + samePathCost(y, z, ants, address);
				pheromoneMatrix[y][z] = temp_pheromone;
			}
		}
	}
}

float calculateProbability(int origin_address, int destination_address, vector<vector<int>> pheromoneMatrix, vector<Address> address) {
	float alpha = 1 , beta = 2;
	return pow(pheromoneMatrix[origin_address][destination_address], alpha) * pow(1 / euclideanDistance(address[origin_address].getOrdinat(), address[origin_address].getAbsis(), address[destination_address].getOrdinat(), address[destination_address].getAbsis()), beta);
}

int roulleteWheel(vector<float> probabilityPercentage) {
	float randNumber = (float)rand() / RAND_MAX;
	vector<float> temp;
	for (int i = 0; i < probabilityPercentage.size(); i++)
	{
		if (i == 0) {
			temp.push_back(0);
			temp.push_back(probabilityPercentage[i]);

			if (randNumber >= 0 && randNumber <= probabilityPercentage[i]) {
				return i;
			}
		}
		else {
			temp.push_back(temp.back());
			temp.push_back(temp.back() + probabilityPercentage[i]);

			if (randNumber >= temp[temp.size() - 2] && randNumber <= temp.back()) {
				return i;
			}
		}
	}
}

float beginACO(vector<Ant> ants, vector<Address> address, int iteration, float evaporate) {
	vector<float> iterationBestCosts;
	vector<vector<int>> pheromoneMatrix;
	initializePheromoneMatrix(address, pheromoneMatrix);

	for (int x = 0; x < iteration; x++)
	{
		// reset semut
		for (int i = 0; i < ants.size(); i++)
		{
			ants[i].clearTravelledAddress();
		}

		int count = 0;
		while (count != 30) {
			for (int i = 0; i < ants.size(); i++) {
				// should be on vector 2d but im retard, so i made 2 vectors
				vector<float> probabilityPercentage;
				vector<int> probabilityAddressIndex;
				for (int j = 0; j < address.size(); j++) {
					if (j != ants[i].getStartingAddress() && ants[i].checkTravelledAddress(j) == false) {
						probabilityPercentage.push_back(calculateProbability(ants[i].getCurrentAddress(), j, pheromoneMatrix, address));
						probabilityAddressIndex.push_back(j);
					}
				}
				ants[i].addTravelledAddress(probabilityAddressIndex[roulleteWheel(probabilityPercentage)]);
				count++;
			}
		}

		// setelah selesai iterasi per semut, dicari cost semut yang paling terkecil
		//float bestCost = 0;
		//for (int i = 0; i < ants.size(); i++) {
		//	// return to the starting address
		//	ants[i].addTravelledAddress(ants[i].getStartingAddress());
		//	if (i == 0) {
		//		bestCost = ants[i].getTotalCost(address);
		//	}
		//	else {
		//		if (ants[i].getTotalCost(address) < bestCost) {
		//			bestCost = ants[i].getTotalCost(address);
		//		}
		//	}
		//}
		//iterationBestCosts.robabilyush_back(bestCost);

		// update pheromoneMatrix
		updatePheromoneMatrix(pheromoneMatrix, address, evaporate, ants);
	}

	// setelah selesai iterasi, dicari cost yang paling terkecil
	float bestCostOverall = 0;
	for (int i = 0; i < ants.size(); i++)
	{
		if (i == 0) {
			bestCostOverall = ants[i].getTotalCost(address);
		}
		else {
			if (ants[i].getTotalCost(address) < bestCostOverall) {
				bestCostOverall = ants[i].getTotalCost(address);
			}
		}
	}
	return bestCostOverall;
}

void main() {
	srand(time((NULL)));

	vector<Address> address;
	vector<Ant> ants;

	addressInitialization(address);

	while (1) {
		system("CLS");

		cout << "Menu:\n";
		cout << "1. Edit Address\n";
		cout << "2. Add Address\n";
		cout << "3. Remove Address\n";
		cout << "4. Display All Address\n";
		cout << "5. Display All Ants\n";
		cout << "6. Best Path\n";
		cout << "0. Exit\n\n";

		hiddenMessage

		cout << "Input menu: ";
		int menu; cin >> menu;

		if (menu == 0) {
			system("CLS");
			break;
		}

		if (menu == 1) {
			system("CLS");

			editAddress(address);

			system("PAUSE");
		}

		if (menu == 2) {
			system("CLS");

			addAddress(address);

			system("PAUSE");
		}

		if (menu == 3) {
			system("CLS");

			removeAddress(address);

			system("PAUSE");
		}

		if (menu == 4) {
			system("CLS");

			cout << "Menu: DISPLAY ADDRESS\n\n";

			displayAddress(address);

			system("PAUSE");
		}

		if (menu == 5) {
			system("CLS");

			for (int i = 0; i < ants.size(); i++)
			{
				cout << i + 1 << ". "; displayAntsCurrentLocation(ants, address, i); cout << endl;
			}

			system("PAUSE");
		}

		if (menu == 6) {
			system("CLS");

			cout << "Input stopping criteria = ";
			int iteration; cin >> iteration;
			float evaporate = 2;
			while (evaporate > 1) {
				cout << "Input evaporate (must be < 1) = ";
				cin >> evaporate;
				if (evaporate > 1) {
					cout << "Evaporate must be less than 1! Please input again.\n\n";
					system("PAUSE");
				}
			}
			antInitialization(address, ants);
			cout << beginACO(ants, address, iteration, evaporate);

			system("PAUSE");
		}
	}
}