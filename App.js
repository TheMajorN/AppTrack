import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Button,
  DatePickerIOS,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
    const statusOptions = [
      { label: 'Applied', color: 'black' },
      { label: 'Rejected', color: 'red' },
      { label: 'Followed-Up', color: 'blue' },
      { label: 'Interviewing', color: 'yellow' },
      { label: 'Blacklisted', color: 'gray' },
    ];

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [addJobModalVisible, setAddJobModalVisible] = useState(false);
  const [editJobModalVisible, setEditJobModalVisible] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [dateApplied, setDateApplied] = useState(new Date().toLocaleDateString());
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0].label);
  const [reminderDate, setReminderDate] = useState(new Date());

  const addJob = () => {
    if (companyName && positionTitle) {
      setJobs([...jobs, { companyName, positionTitle, dateApplied }]);
      setAddJobModalVisible(false);
      // Reset input fields
      setCompanyName('');
      setPositionTitle('');
      setDateApplied(new Date().toLocaleDateString());
      // You can add logic to save the job data to storage or API
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleJobClick(item)}>
      <View style={[styles.jobItem, { backgroundColor: item.status ? item.status.color : 'white' }]}>
        <Text>{item.companyName}</Text>
        <Text>{item.positionTitle}</Text>
        <Text>Date Applied: {item.dateApplied}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleJobClick = (item) => {
    setSelectedJob(item);
    setEditJobModalVisible(true);
  };

    const setJobStatus = () => {
      const updatedJobs = [...jobs];
      updatedJobs[jobs.findIndex((job) => job === selectedJob)] = { ...selectedJob, status: selectedStatus };
      setJobs(updatedJobs);
      setEditJobModalVisible(false);
      setSelectedJob(null);
      // You can add logic to update the job data in storage or API
    };

  const setJobReminder = () => {
    const updatedJobs = [...jobs];
    updatedJobs[jobs.findIndex((job) => job === selectedJob)] = { ...selectedJob, reminderDate };
    setJobs(updatedJobs);
    setEditJobModalVisible(false);
    setSelectedJob(null);
    // You can add logic to update the job data in storage or API
  };

const renderStatusDropdown = () => (
  <View style={styles.dropdownContainer}>
    <Text>Status</Text>
    <Picker
      selectedValue={statusOptions.label}
      onValueChange={(itemValue, itemIndex) => setSelectedStatus(statusOptions[itemIndex])}
    >
      {statusOptions.map((option) => (
        <Picker.Item
          key={option.label}
          label={option.label}
          value={option.label}
          style={{ color: option.color, fontSize: 16 }}
        />
      ))}
    </Picker>
  </View>
);

  const renderReminderSection = () => (
    <View>
      <Text>Select Reminder Date:</Text>
      {Platform.OS === 'ios' && (
        <DatePickerIOS
          date={reminderDate}
          onDateChange={(newDate) => setReminderDate(newDate)}
          mode="date"
        />
      )}
      <Button title="Set Reminder" onPress={setJobReminder} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setAddJobModalVisible(true)}>
        <Text>Add Job</Text>
      </TouchableOpacity>

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={addJobModalVisible}
        onRequestClose={() => setAddJobModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Company Name"
            value={companyName}
            onChangeText={(text) => setCompanyName(text)}
          />
          <TextInput
            placeholder="Position Title"
            value={positionTitle}
            onChangeText={(text) => setPositionTitle(text)}
          />
          <TextInput
            placeholder="Date Applied"
            value={dateApplied}
            onChangeText={(text) => setDateApplied(text)}
          />
          <Button title="Confirm" onPress={addJob} />
          <Button title="Close" onPress={() => setAddJobModalVisible(false)} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editJobModalVisible}
        onRequestClose={() => {
          setEditJobModalVisible(false);
          setSelectedJob(null);
        }}
      >
        <View style={styles.modalContainer}>
          <Text>{selectedJob ? selectedJob.companyName : ''}</Text>
          <Text>{selectedJob ? selectedJob.positionTitle : ''}</Text>
          <Text>Date Applied: {selectedJob ? selectedJob.dateApplied : ''}</Text>
          {renderStatusDropdown()}
          {renderReminderSection()}
          <Button title="Close" onPress={() => setEditJobModalVisible(false)} />
          <Button title="Save Status" onPress={setJobStatus} />
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  jobItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
});